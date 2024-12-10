import React, { useEffect, useRef, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import PanToolIcon from '@mui/icons-material/PanTool';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
    backgroundColor: 'black'
  },
  sideMenu: {
    width: '80px',
    backgroundColor: '#3A3A3A',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#3F53D9',
  },
  sideComponent: {
    width: '300px',
    backgroundColor: '#3A3A3A',
    padding: '16px',
    overflowY: 'auto',
    color: '#ccc',
  },
  canvasContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  canvas: {
    width: '100%',
    height: '100%',
    border: '1px solid black',
    backgroundColor: 'black',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px',
    //backgroundColor: '#3A3A3A',
    color: '#ccc'
  },
}));

const CaseReport: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const image = new Image();
    image.src = 'https://synbrain.ai/public/media/paper-camera-ready-final-com-acento-21.jpg'; // Replace with your sample image URL
    image.onload = () => {
      if (context && canvas) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.translate(offset.x, offset.y);
        context.scale(scale, scale);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        context.restore();
      }
    };
  }, [scale, offset]);

  const handleBack = () => {
    navigate('/cases');
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
  };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPanning) {
        setOffset((prevOffset) => ({
            x: prevOffset.x + e.clientX - panStart.x,
            y: prevOffset.y + e.clientY - panStart.y,
        }));
        setPanStart({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

  return (
    <div className={classes.root}>
      <div className={classes.sideMenu}>
        <Typography className={classes.logo}>IQ</Typography>
        <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
          Back
        </Button>
      </div>
      <div className={classes.sideComponent}>
        <Typography variant="h6">Case Information</Typography>
        {"lorem ipsum dolor sit amet"}
      </div>
      <div className={classes.canvasContainer}>
        <div className={classes.toolbar}>
          <IconButton>
            <ZoomInIcon onClick={handleZoomIn}/>
          </IconButton>
          <IconButton>
            <ZoomOutIcon onClick={handleZoomOut}/>
          </IconButton>
        </div>
        <canvas 
            ref={canvasRef} 
            className={classes.canvas}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        ></canvas>
      </div>
    </div>
  );
};

export default CaseReport;