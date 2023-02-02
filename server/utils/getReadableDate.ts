const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getReadableDate = (date: Date) => {
    const currentDate = new Date(date);
    const day = currentDate.getDate();
    const month = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    const dayLastDigit = day % 10;
    const dayPrefix =
        dayLastDigit === 1 ? "st" : dayLastDigit === 2 ? "nd" : dayLastDigit === 3 ? "rd" : "th";

    return `${day}${dayPrefix} ${month}, ${year}`;
};

export default getReadableDate;
