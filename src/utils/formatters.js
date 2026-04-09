/**
 * Format duration in milliseconds to human-readable string
 */
function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        const remainingMinutes = minutes % 60;
        return `${hours}ч ${remainingMinutes}мин`;
    }
    return `${minutes}мин`;
}

/**
 * Format a date to a readable russian string
 */
function formatDate(date) {
    const d = new Date(date);
    const months = [
        'янв', 'фев', 'мар', 'апр', 'май', 'июн',
        'июл', 'авг', 'сен', 'окт', 'ноя', 'дек',
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

module.exports = { formatDuration, formatDate };
