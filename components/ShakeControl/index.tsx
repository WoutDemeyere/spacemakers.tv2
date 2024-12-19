import { askPermission } from "@/utils/askDeviceRotationPermission";
import { Switch } from "@mantine/core";
import { useEffect, useState } from "react";
import ShakeDetector from "shake-detector";

interface ShakeControlProps {
  executeRequest: (button: { text: string; layerIndex: number; clipIndex: number }) => void;
}

const ShakeControl: React.FC<ShakeControlProps> = ({ executeRequest }) => {
  const [isShakeEnabled, setIsShakeEnabled] = useState(false);

  useEffect(() => {
    console.log('isShakeEnabled', isShakeEnabled);
    if (isShakeEnabled) {
      askPermission(() => {
        initShake();
      }, () => {
        alert('Zonder toestemming kan deze functie niet worden gebruikt, herstart de browser om opnieuw te proberen.');
      });
    }
  }, [isShakeEnabled]);


  const initShake = () => {
    const options = {
      threshold: 10,
      debounceDelay: 1500,
    };

    const shakeDetector = new ShakeDetector(options).confirmPermissionGranted().subscribe(onShake).start();
    setIsShakeEnabled(shakeDetector !== null);
  }

  const onShake = () => {
    console.log('shake event');
    if (isShakeEnabled) {
      executeRequest({ text: 'SHAKE', layerIndex: 4, clipIndex: 1 });
    }
  }

  return (
    <Switch
      color='blue'
      style={{ margin: '15px', color: 'white' }}
      label="ENABLE SHAKE TO TRIGGER"
      checked={isShakeEnabled}
      onChange={() => setIsShakeEnabled(!isShakeEnabled)}
    />
  );
}

export default ShakeControl;