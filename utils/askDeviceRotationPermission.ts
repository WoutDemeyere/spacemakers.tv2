
export const askPermission = (onGranted: () => void, onDenied: () => void) => {

  if (
    typeof DeviceMotionEvent !== 'undefined' &&
    typeof (DeviceMotionEvent as any).requestPermission === 'function'
  ) {
    (DeviceMotionEvent as any)
      .requestPermission()
      .then((response: any) => {
        console.log('permission response', response);
        if (response === 'granted') {
          onGranted();
        } else {
          onDenied();
        }
      })
      .catch((error: any) => {
        console.error(error);
        alert('Er is een fout opgetreden bij het aanvragen van toestemming.');
      });
  } else {
    // For devices that do not require permission or do not support it
    onGranted();
  }
};