import placeholderImage from "@/public/images/placeholder.png";
import { X } from "lucide-react";
export const NumberDisplay = ({ value }) => {
    const formatted = new Intl.NumberFormat('en-US').format(value);
    return <span>{formatted}</span>;
};

export const getImageSrc = (url) => {
    if (url) {
        return typeof url === "object" ? url.src : url;
    }
    return typeof placeholderImage === "object" ? placeholderImage.src : placeholderImage;
};

export const imageErrorHandler = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = typeof placeholderImage === "object" ? placeholderImage.src : placeholderImage;
};
export const formatIDRCustom = (value, options = {}) => {
    const {
        withPrefix = false,
        decimalPlaces = 2,
    } = options;

    if (value == null || value === '') return withPrefix ? 'Rp 0' : '0';

    // Clean input: remove Rp, spaces, and non-numeric characters except . and ,
    let stringValue = value.toString().replace(/[^0-9.,]/g, '');

    // Normalize string:
    // If contains ',' but not '.', assume ',' is thousands separator
    // If contains '.' but not ',', assume '.' is decimal
    // If contains both, decide based on position
    if (stringValue.includes(',') && !stringValue.includes('.')) {
        // comma as thousands separator
        stringValue = stringValue.replace(/,/g, '');
    } else if (stringValue.includes('.') && !stringValue.includes(',')) {
        // dot as decimal separator, okay as-is
    } else if (stringValue.includes(',') && stringValue.includes('.')) {
        // Decide which is decimal
        if (stringValue.lastIndexOf(',') > stringValue.lastIndexOf('.')) {
            // comma is decimal
            stringValue = stringValue.replace(/\./g, '').replace(',', '.');
        } else {
            // dot is decimal
            stringValue = stringValue.replace(/,/g, '');
        }
    }

    const numericValue = parseFloat(stringValue);
    if (isNaN(numericValue)) return withPrefix ? 'Rp 0' : '0';

    // Format number as Indonesian currency (dot = thousands, comma = decimal)
    const parts = numericValue.toFixed(decimalPlaces).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // thousands sep
    const result = parts.join(',');

    return withPrefix ? `Rp ${result}` : result;
};


export const uniqueBeds = (units) => {
    return units.filter((unit, index) => index === units.findIndex(o => unit.bedroom === o.bedroom)).sort((a, b) => a.bedroom_order - b.bedroom_order)
}

export const SelectedItemsBadge = ({ disabled, item, handleRemove }) => {
    return (
        <div
            key={item.id}
            className={`border ${disabled ? "pointer-events-none opacity-50 border-gray-300 bg-muted" : "cursor-pointer bg-primary/95 hover:bg-white border-primary text-white hover:text-primary"} group px-2 py-1 rounded-md flex items-center gap-1 text-xs borde relative z-4`}
            onClick={handleRemove}
        >
            {item.name}
            <X
                className="w-3 h-3 group-hover:text-primary"
            />
        </div>
    )
}

export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};
