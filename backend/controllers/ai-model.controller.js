const aiModelService = require("../services/ai-model.service");
const Tooth = require('../models/tooth.model');
const { Op } = require('sequelize');

exports.vulnerabilities = async (req, res) => {
    const image = req.file;
    
    if (!image) {
        return res.status(400).send({ message: "Image is required!" });
    }

    try {
        const result = await aiModelService.sendImageToModel('vulnerabilities', image);
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "Failed to process image" });
    }
};

exports.segment = async (req, res) => {
    const image = req.file;
    
    if (!image) {
        return res.status(400).send({ message: "Image is required!" });
    }

    try {
        const result = await aiModelService.sendImageToModel('segment', image);
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "Failed to process image" });
    }
}

exports.combine = async (req, res) => {
    const image = req.file;
    const {caseId, img} = req.body;

    if (!image) {
      return res.status(400).send({ message: "Image is required!" });
    }
  
    try {
      const vulnerabilitiesResult = await aiModelService.sendImageToModel('vulnerabilities', image);
      const segmentResult = await aiModelService.sendImageToModel('segment', image);
      // Calculate center point of vulnerability bbox
      const getVulnerabilityCenter = (bbox) => ({
        x: (bbox[0] + bbox[2]) / 2,
        y: (bbox[1] + bbox[3]) / 2
      });

      // Calculate if point is inside tooth boundary
      const isPointInTooth = (point, tooth) => {
        return point.x >= tooth.x1 && 
               point.x <= tooth.x2 && 
               point.y >= tooth.y1 && 
               point.y <= tooth.y2;
      };
  
      const enrichedPredictions = segmentResult.predictions.map(tooth => {
        // Find vulnerabilities whose center point falls within this tooth's bounds
        const matchingVulnerabilities = vulnerabilitiesResult.filter(vulnerability => {
          const center = getVulnerabilityCenter(vulnerability.bbox);
          return isPointInTooth(center, {
            x1: tooth.x,
            y1: tooth.y,
            x2: tooth.x + tooth.width,
            y2: tooth.y + tooth.height
          });
        });
        return {
          ...tooth,
          vulnerabilities: matchingVulnerabilities
        };
      });
      const combinedResult = {
        image: segmentResult.image,
        predictions: enrichedPredictions
      };



      const bulkUpdateData = combinedResult.predictions.map((tooth) => {
        const vulnerabilities = tooth.vulnerabilities;
      
        if (!vulnerabilities.length) {
          // Healthy tooth
          return {
            caseId,
            number: tooth.class_id,
            severity: 'Healthy',
          };
        } else {
          let low = 0, medium = 0, high = 0;
      
          vulnerabilities
            .filter((vulnerability) => vulnerability.confidence > 0.5)
            .forEach((vulnerability) => {
              if (vulnerability.risk_level === "Low") {
                low++;
              } else if (vulnerability.risk_level === "Medium") {
                medium++;
              } else {
                high++;
              }
            });
      
          const max = Math.max(low, medium, high);
          let severity = "Low";
          if (max === medium) {
            severity = "Medium";
          } else if (max === high) {
            severity = "High";
          }
      
          return {
            caseId,
            number: tooth.class_id,
            severity,
          };
        }
      });

      const results = await updateTeethSeverity(bulkUpdateData, Tooth);
      res.send(combinedResult);
    } catch (error) {
      console.error('Combination error:', error);
      res.status(500).send({ message: "Failed to process image" });
    }
};

async function updateTeethSeverity(bulkUpdateData, ToothModel) {
  try {
    // Group the updates by caseId to optimize the number of queries
    const updates = bulkUpdateData.map(({ caseId, number, severity }) => ({
      where: {
        [Op.and]: [
          { caseId: caseId },
          { number: number }
        ]
      },
      update: {
        severity: severity
      }
    }));

    // Perform bulk update using Promise.all for parallel processing
    const results = await Promise.all(
      updates.map(({ where, update }) =>
        ToothModel.update(update, {
          where: where,
          returning: true // This will return the updated records (PostgreSQL only)
        })
      )
    );

    // Count successful updates
    const updatedCount = results.reduce(
      (acc, [count]) => acc + count,
      0
    );

    return {
      success: true,
      message: `Successfully updated ${updatedCount} teeth records`,
      updatedCount
    };
  } catch (error) {
    console.error('Error in bulk update:', error);
    return {
      success: false,
      message: 'Failed to update teeth records',
      error: error.message
    };
  }
}