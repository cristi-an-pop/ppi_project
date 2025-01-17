import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Case } from '@/types/Case';
import { Tooth, ToothSeverity } from '@/types/Tooth';
import { axiosPrivate } from '@/api/axios';
import casesService from '../../services/cases.service';
import ToothItem from './ToothItem';
import aiService from '../../services/ai.service';
import { useFileStorage } from '@/hooks/useFileStorage';


const getSeverityColor = (severity: ToothSeverity): string => {
  const colors = {
    healthy: 'bg-green-500 border-green-500',
    low: 'bg-yellow-400 border-yellow-400',
    medium: 'bg-orange-500 border-orange-500',
    high: 'bg-red-500 border-red-500',
    missing: 'bg-gray-600 border-gray-600'
  };
  return colors[severity] || colors.healthy;
};

const API_BASE_URL = "http://localhost:5000";


// API service
const fetchDentalRecord = async (id: string): Promise<Case> => {
  const response = await casesService.getCaseById(axiosPrivate, id);
  return response.data;
};

const DentalChart: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getFile } = useFileStorage();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['id', id],
    queryFn: () => fetchDentalRecord(id!),
    enabled: !!id
  });

  const queryClient = useQueryClient();


  const handleToothClick = (tooth: Tooth) => {

    //TODO - Implement tooth click handler call backed
    console.log('Tooth clicked:', tooth);
  };

  const handleRegionSelect = (region: string) => {
    console.log('Region selected:', region);
  };

  const handleEditNumbers = () => {
    console.log('Edit numbers clicked');
  };

  const handleGetAiAnalysis = async () => {
    const radiography = await getFile(data!.id!);
    if (!radiography) {
      alert('No radiography found');
      return;
    }
    const formData = new FormData();
    formData.append('image', radiography);
    formData.append('caseId', id!);
    //Start animation / placeholder here
    setIsAnalyzing(true);
    try {
      await aiService.getAiAnalysis(axiosPrivate, formData);
      await fetchDentalRecord(data!.id!);
      await queryClient.invalidateQueries(['id', id]);
    } finally {
      setIsAnalyzing(false);
    }

    //Stop animation / placeholder here
  }

  if (isAnalyzing) {
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

  const upperTeeth = data.teeth
    .filter(tooth => tooth.number <= 16)
    .sort((a, b) => a.number - b.number);

  const lowerTeeth = data.teeth
    .filter(tooth => tooth.number > 16)
    .sort((a, b) => a.number - b.number);

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
                  onClick={handleGetAiAnalysis}

                  className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Analizeaza cu A.I.</Button>

        </div>
      </CardHeader>
      <CardContent>
        {/* X-Ray Image */}
        <div className="mb-6 bg-black rounded-lg overflow-hidden">
          <img 
            src={`${API_BASE_URL}/${data.image}` } 
            alt="Dental X-Ray"
            className="w-100 object-contain"/>
        </div>



        <div className="grid grid-cols-8 grid-rows-2 gap-1">
          {/* Teeth - Combined Upper and Lower */}
          {upperTeeth.concat(lowerTeeth).map((tooth, index) => (
            <ToothItem
              key={`${tooth.id}-${tooth.severity}`}
              id={tooth.id}
              clientId={tooth.clientId}
              number={tooth.number}
              severity={tooth.severity}
              handleToothClikc={handleToothClick}
            />
          ))}
        </div>

      

        {/* Legend */}
        <div className="mt-6 flex gap-4 justify-center">
          {Object.entries({
            healthy: 'Sanatos',
            low: 'Risc scazut',
            medium: 'Risc mediu',
            high: 'Risc ridicat',
            missing: 'Lipsa'
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
      </CardContent>
    </Card>
  );
};

export default DentalChart;