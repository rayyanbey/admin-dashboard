// Convert 24-hour format to 12-hour format with AM/PM
export const formatTime12Hour = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const twelveHour = h % 12 || 12;
    return `${twelveHour}:${minutes} ${suffix}`;
  };
  
  // Convert 12-hour format to 24-hour format for time inputs
  export const formatTime24Hour = (time12) => {
    if (!time12) return '';
    const [time, suffix] = time12.split(' ');
    const [hours, minutes] = time.split(':');
    let h = parseInt(hours, 10);
    if (suffix === 'PM' && h < 12) h += 12;
    if (suffix === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${minutes}`;
  };