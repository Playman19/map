export async function getLocationInfo(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.address) {
            return data.address; // Возвращаем информацию о месте
        } else {
            console.error('Информация не найдена');
            return null;
        }
    } catch (error) {
        console.error('Ошибка при получении информации:', error);
        return null;
    }
}