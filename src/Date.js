export const formatDate=(dt)=>{
  if(!dt){
    return '';
  }
  var date = new Date(dt);
  if(isNaN(date.getTime())){
    return dt;
  }
  // Get the full year (4 digits)
  const year = date.getFullYear();

  // Get the month (0-based, so add 1)
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Pad with '0' if month < 10

  // Get the day of the month
  const day = String(date.getDate()).padStart(2, '0'); // Pad with '0' if day < 10

  // Return the formatted date string in yyyy-MM-dd format
  return `${year}-${month}-${day}`;
}

export const formatDateTime = (dt) => {
  if (!dt) {
    return '';
  }
  var date = new Date(dt);

  if(isNaN(date.getTime()))
    return dt;
  // Get the full year (4 digits)
  const year = date.getFullYear();

  // Get the month (0-based, so add 1)
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Pad with '0' if month < 10

  // Get the day of the month
  const day = String(date.getDate()).padStart(2, '0'); // Pad with '0' if day < 10

  // Get hours, minutes, and seconds
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Determine AM or PM
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12; // Convert to 12-hour format
  hours = hours ? String(hours).padStart(2, '0') : '12'; // Handle 12 AM/PM case

  // Return the formatted date and time string in yyyy-MM-dd hh:mm:ss AM/PM format
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
}

