import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { Case } from '@/types/Case';
import { Tooth, ToothSeverity } from '@/types/Tooth';
import { axiosPrivate } from '@/api/axios';
import casesService from '../../services/cases.service';
import ToothItem from './ToothItem';
import teethService from '../../services/teeth.service';

const RISK_LEVELS = {
  0: "Low risk",    // Implant
  1: "Low risk",    // Prosthetic restoration
  2: "Low risk",    // Obturation
  3: "Low risk",    // Endodontic treatment
  12: "Low risk",   // Orthodontic device
  13: "Low risk",   // Surgical device
  4: "Medium risk", // Carious lesion
  5: "Medium risk", // Bone resorbtion
  6: "Medium risk", // Impacted tooth
  10: "Medium risk",// Apical surgery
  7: "High risk",   // Apical periodontitis
  8: "High risk",   // Root fragment
  9: "High risk",   // Furcation lesion
  11: "High risk"   // Root resorption
}

const mapRiskLevelToSeverity = (riskLevel: number): ToothSeverity => {
  if (riskLevel == -1)
    return 'missing';
  if (riskLevel <= 3 || riskLevel === 12 || riskLevel === 13) {
    return 'low';
  }
  if (riskLevel == 4 || riskLevel == 5 || riskLevel == 6 || riskLevel == 10) {
    return 'medium';
  }
  if (riskLevel == 7 || riskLevel == 8 || riskLevel == 9 || riskLevel == 11) {
    return 'high';
  }
  return 'healthy'
}

const getSeverityColor = (severity: ToothSeverity): string => {
  const colors = {
    healthy: 'bg-blue-100 border-blue-300',
    low: 'bg-yellow-100 border-yellow-300',
    medium: 'bg-orange-300 border-orange-500',
    high: 'bg-red-300 border-red-500',
    missing: 'bg-gray-200 border-gray-400'
  };
  return colors[severity] || colors.healthy;
};

const API_BASE_URL = "http://localhost:5000";

// API service
const fetchDentalRecord = async (id: string): Promise<Case> => {
  const response = await casesService.getCaseById(axiosPrivate, id);
  console.log("Data", response.data);
  return response.data;
};

const DentalChart: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedTooth, setSelectedTooth] = useState<Tooth | null>(null);
  const [descriptionCards, setDescriptionCards] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['id', id],
    queryFn: () => fetchDentalRecord(id!),
    enabled: !!id
  });

  useEffect(() => {
    if (data && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const image = new Image();
        image.src = `${API_BASE_URL}/${data.image}`;
        image.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          if (selectedTooth) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(selectedTooth.x1, selectedTooth.y1, selectedTooth.x2 - selectedTooth.x1, selectedTooth.y2 - selectedTooth.y1);
          }
        };
      }
    }
  }, [data, selectedTooth]);

  useEffect(() => {
    if (selectedTooth) {
      setDescriptionCards(selectedTooth.description.split('|').map(desc => desc.trim()));
    }
  }, [selectedTooth]);

  const handleToothClick = (tooth: Tooth) => {
    console.log('Tooth clicked:', tooth);
    setSelectedTooth(tooth);
  };

  const handleRegionSelect = (region: string) => {
    console.log('Region selected:', region);
  };

  const handleEditNumbers = () => {
    console.log('Edit numbers clicked');
  };

  const handleAddCard = () => {
    setDescriptionCards([...descriptionCards, '']);
  };

  const handleDeleteCard = (index: number) => {
    const newCards = descriptionCards.filter((_, i) => i !== index);
    setDescriptionCards(newCards);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newCards = descriptionCards.map((card, i) => (i === index ? value : card));
    setDescriptionCards(newCards);
  };

  const handleSaveDescription = () => {
    if (selectedTooth) {
      const updatedTooth = { ...selectedTooth, description: descriptionCards.join(' | ') };
      setSelectedTooth(updatedTooth);
      teethService.updateTooth(axiosPrivate, selectedTooth.id, updatedTooth);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-40" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-64 mb-6" />
          <div className="space-y-4">
            <Skeleton className="w-full h-24" />
            <Skeleton className="w-full h-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center text-red-500">
          Error loading dental record: {(error as Error).message}
        </div>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Dental Chart</CardTitle>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handleEditNumbers}
            className="text-sm"
          >
            Modifica Dinte
          </Button>
          <Button
            variant="outline"
            onClick={() => handleRegionSelect('all')}
            className="text-sm"
          >
            Selecteaza regiunea de interes
          </Button>
          <Button type="button" 
                  variant="outline"
                  onClick={() => alert('BOOM!')}
                  className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Analizeaza cu A.I.</Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* X-Ray Image */}
        <div className="mb-6 bg-black rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={640} height={288} className="w-full h-auto" />
        </div>

        <div className="grid grid-cols-8 grid-rows-2 gap-1">
          {/* Teeth - Combined Upper and Lower */}
          {data.teeth
            .sort((a, b) => a.class - b.class)
            .map((tooth) => (
              <ToothItem
                key={tooth.id}
                id={tooth.id}
                clientId={tooth.clientId}
                number={tooth.class || tooth.number}
                severity={mapRiskLevelToSeverity(tooth.problem)}
                onClick={() => handleToothClick(tooth)}
              />
            ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex gap-4 justify-center">
          {Object.entries({
            healthy: 'Healthy',
            low: 'Low severity',
            medium: 'Medium severity',
            high: 'High severity',
            missing: 'Missing'
          }).map(([severity, label]) => (
            <div key={severity} className="flex items-center gap-2">
              <div
                className={`w-4 h-4 border-2 rounded ${getSeverityColor(
                  severity as ToothSeverity
                )}`}
              />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>

        {/* Tooth Description */}
        {selectedTooth && (
          <div className="ml-6 p-4 border rounded-lg bg-white shadow-md">
            <h3 className="text-lg font-semibold mb-2">Tooth {selectedTooth.number}</h3>
            <div className="space-y-2">
              {descriptionCards.map((card, index) => (
                <div key={index} className="p-2 border rounded-lg bg-gray-100">
                  <textarea
                    className="w-full p-2 border rounded-lg"
                    value={card}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  />
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => handleDeleteCard(index)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={handleAddCard}>
                Add Card
              </Button>
              <Button variant="outline" onClick={handleSaveDescription}>
                Save Description
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DentalChart;