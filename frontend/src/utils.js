const formatDate = (string) => {
    var dt = new Date(string);
    return `${dt.getMonth() + 1}/${dt.getUTCDate()}/${dt.getFullYear()}`
}

const formatDateFull = (string) => {
    var dt = new Date(string);
    const longMonth = dt.toLocaleString('en-us', { month: 'long' })
    return `${longMonth} ${dt.getUTCDate()}, ${dt.getFullYear()} at ${dt.getUTCHours()}:${dt.getUTCMinutes().toString().padStart(2, "0")}`
}

export {formatDate, formatDateFull}