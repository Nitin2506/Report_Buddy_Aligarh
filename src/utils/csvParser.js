const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const parsedData = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = [];
        let current = '';
        let inQuotes = false;

        for (let char of line) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());

        const row = {};
        headers.forEach((header, index) => {
            let value = values[index] || '';
            if (header === 'Date' && value) {
                const parts = value.split('-');
                if (parts.length === 3) {
                    value = `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert DD-MM-YYYY to YYYY-MM-DD
                }
            }
            row[header] = value;
        });
        parsedData.push(row);
    }

    return parsedData;
};

export default parseCSV;
