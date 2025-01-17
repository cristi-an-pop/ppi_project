const aiModelService = require("../services/ai-model.service");

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

exports.combine2 = async (req, res) => {
    const image = req.file;
  
    if (!image) {
      return res.status(400).send({ message: "Image is required!" });
    }
  
    try {
      const vulnerabilitiesResult = await aiModelService.sendImageToModel('vulnerabilities', image);
      const segmentResult = await aiModelService.sendImageToModel('segment2', image);

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

      console.log("Combined result:", combinedResult);
  
      res.send(combinedResult);
    } catch (error) {
      console.error('Combination error:', error);
      res.status(500).send({ message: "Failed to process image" });
    }
};

exports.combine = async (req, res) => {
  const image = req.file;

  if (!image) {
    return res.status(400).send({ message: "Image is required!" });
  }

  try {
    const vulnerabilitiesResult = await aiModelService.sendImageToModel('vulnerabilities', image);
    const segmentResult = await aiModelService.sendImageToModel('segment3', image);

    // Calculate center point of vulnerability bbox
    const getVulnerabilityCenter = (bbox) => ({
      x: (bbox[0] + bbox[2]) / 2,
      y: (bbox[1] + bbox[3]) / 2
    });

    // Calculate if point is inside tooth boundary
    const isPointInTooth = (point, tooth) => {
      return point.x >= tooth.bbox[0] && 
             point.x <= tooth.bbox[2] && 
             point.y >= tooth.bbox[1] && 
             point.y <= tooth.bbox[3];
    };

    const enrichedPredictions = segmentResult.map(tooth => {
      // Find vulnerabilities whose center point falls within this tooth's bounds
      const matchingVulnerabilities = vulnerabilitiesResult.filter(vulnerability => {
        const center = getVulnerabilityCenter(vulnerability.bbox);
        return isPointInTooth(center, tooth);
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

    console.log("Combined result:", combinedResult);

    console.log(combinedResult)
    res.send(combinedResult);
  } catch (error) {
    console.error('Combination error:', error);
    res.status(500).send({ message: "Failed to process image" });
  }
};