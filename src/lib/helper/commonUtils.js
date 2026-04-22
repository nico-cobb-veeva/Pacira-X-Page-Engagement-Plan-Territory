const _veevaUtils = new window.VeevaUtilities();

/** Returns IN statement from an array for MyInsights query */
export const getInStatementArray = (values) => {
    if(!isOnline()) {
        if(values) {
            return `{'` + values.join(`', '`) + `'}`;
        } else {
            return '{}';
        }
    } else {
        if(values) {
            return `('` + values.join(`', '`) + `')`;
        } else {
            return '()';
        }
    }
}

/** Returns an IN statement from a Set of IDs for MyInsights query */
export const getInStatement = (values) => {
    if(values) {
        return `{'` + values.toArray().join(`', '`) + `'}`;
    } else {
        return '{}';
    }
}

/** Returns an IN statement from a single ID for MyInsights query */
export const getInStatementString = (value) => {
    if(value) {
        return `{'` + value + `'}`;
    } else {
        return '{}';
    }
}

/**
* Verifies if an object is empty
* @param {Object} obj
* @returns true if object is empty or else false.
*/
export const isObjectEmpty = (obj) => {
    for(var key in obj) {
        //if(obj.hasOwnProperty(key))   // lint says no
        if(Object.prototype.hasOwnProperty.call(obj, key))
            return false;
    }
    return true;
};

/**
* Converts array to object
* @param {Array} array in context
* @param {String} keyField as the object key
* @param {String} valueField as value
* @return {Object} obj
*/
export const arrayToObject = (array, keyField, valueField) => {
    if(array && array.length > 0) {
        return array.reduce((obj, item) => {
            obj[item[keyField]] = item[valueField];
            return obj;
        }, {});
    } else {
        return {};
    }
};

/**
* Formats string literal {0}, {1} with specified values
* Treat the first argument as a pattern and return a string using the second argument for substitution and formatting.
*/
export const formatStr = (strToFormat, ...values) => {
    return strToFormat.replace(/\{(\d+)\}/g, (match, index) => {
        return values[index];
    });
};

/**
* Determine if an array contains one or more items from another array.
* @param {Array} haystack the array to search.
* @param {Array} arr the array providing items to check for in the haystack.
* @return {Boolean} true|false if haystack contains at least one item from arr.
*/
export const existInArray = (haystack, arr) => {
    return arr.some(item => {
        return haystack.indexOf(item) >= 0;
    });
};

/**
* Test the existence of a string in an array of string.
* @param {Array} array
* @param {String} str
* @returns {Boolean} true if found and false if not found.
*/
export const existsIgnoreCase = (array, str) => {
    return -1 !== indexOfIgnoreCase(array, str);
};

/**
* Find the index of a string in an array of string.
* @param {Array} array
* @param {String} str
* @returns {Number} the index of the str in the array or -1 if not found.
*/
export const indexOfIgnoreCase = (array, str) => {
    let ret = -1;
    if(array && array.length > 0) {
        array.some(function(item, index) {
            if(equalsIgnoreCase(str, item)) {
                ret = index;
                return true;
            }
        });
    }
    return ret;
}

/**
* Test for String equality ignoring case.
* @param {String} str1
* @param {String} str2
* @returns {Boolean} true if both string is equals ignoring case.
*/
export const equalsIgnoreCase = (str1, str2) => {
    return str1.trim().toLowerCase() === str2.trim().toLowerCase();
}

/**
* converts specified string to proper title case
*/
export const toProperCase = (str) => {
    return str.split(' ')
           .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
           .join(' ');
};

export const isOnline = () => {
    return _veevaUtils.isOnline();
};

/**
* Different MyInsights platform implementations return different values for true/false. Use this as an abstraction layer: `if(utils.isTruthy(foo)) {...}`
* @param {Any} value
* @returns {Boolean} Truth value of the argument
*/
export const isTruthy = (value) => {
    return (
        value == true ||
        (typeof value == "string" && value.toLowerCase() == "true") ||
        (typeof value == "number" && value != 0)
    );
};

/**
* Use with BaseSearch and BaseDataTable to filter the table rows based on searchTerm
* @param {Array} tableRows
* @param {String} searchTerm
* @param {Array} searchKeys
* @returns {Array} Filtered List of Options
*/
export const filterTableRowsByTerm = (tableRows, searchTerm, searchKeys) => {
	return tableRows.filter((row) => {
		if (!searchTerm.value) return true;
		const term = searchTerm.value.toLowerCase().trim();
		return searchKeys.some((key) => {
			const fieldValue = row?.[key]?.value?.toLowerCase();
			return fieldValue?.includes(term);
		});
	});
}

/**
* Use with BaseSearch and BaseDataTable to filter the table rows based on searchTerm
* @param {Array} tableRows
* @param {String} searchTerm
* @param {Array} searchKeys
* @returns {Array} Filtered List of Options
*/
export const filterTableRowsByTermMultiKey = (tableRows, searchTerm, searchKeys) => {
	const rawTerm = typeof searchTerm === 'string' ? searchTerm : searchTerm.value;
	if (!rawTerm) return tableRows;

	const keywords = rawTerm.toLowerCase().trim().split(/\s+/);

	return tableRows.filter((row) => {
		return keywords.every((keyword) => {
			return searchKeys.some((key) => {
				const fieldValue = row?.[key]?.value?.toLowerCase?.() || '';
				return fieldValue.includes(keyword);
			});
		});
	});
};


/**
* Use with BaseSearchDropdown to filter the options based on searchTerm
* @param {Array} options
* @param {String} searchTerm
* @param {Array} keys
* @returns {Array} Filtered List of Options
*/
export const filterDropdownOptionsByTerm = (options, searchTerm, identifierKeys) => {
    return options.filter((option) => {
        if (!searchTerm.value) return true;
        const term = searchTerm.value.toLowerCase().trim();
        const matchesDisplay = option.display?.toLowerCase().includes(term);
        const matchesIdentifiers = identifierKeys.some((key) => {
            return option.identifiers?.[key]?.toLowerCase().includes(term);
        });
        return matchesDisplay || matchesIdentifiers;
    })
}

/**
* Use with BaseSearchDropdown to filter the options based on searchTerm
* @param {Array} options
* @param {String} searchTerm
* @param {Array} keys
* @returns {Array} Filtered List of Options
*/
export const filterDropdownOptionsByTermMultiKey = (options, searchTerm, identifierKeys) => {
	if (!searchTerm.value) return options;

	const terms = searchTerm.value.toLowerCase().trim().split(/\s+/);

	return options.filter(option => {
		const searchableText = [
			option.display,
			...identifierKeys.map(key => option.identifiers?.[key])
		]
			.filter(Boolean) // remove undefined/null
			.map(val => val.toLowerCase())
			.join(' ');

		// every keyword must match somewhere in the concatenated string
		return terms.every(term => searchableText.includes(term));
	});
};

/*
* checks if value is safe
*/
export const safe = (value) => {
    return (value !== null && value !== undefined && value !== '') ? value : null;
}

/*
* formats address
*/
export const formatAddress = (addrLine1, addrLine2, city, state, zipCode, country) => {
    const parts = [
        safe(addrLine1),
        safe(addrLine2),
        safe(city)
    ].filter(Boolean); // filters out null, undefined, and empty strings

    const addressLine = parts.join(', ');
    let fullAddress = safe(state) ? `${addressLine}, ${state}` : addressLine;
    fullAddress = safe(zipCode) ? `${fullAddress} ${zipCode}` : fullAddress;
    fullAddress = safe(country) ? `${fullAddress}, ${country}` : fullAddress;

  return fullAddress;
};

// removes __c/__v suffix and capitalize first letter and lowercase the rest
export const capitalizeWords = (str) => {
    // first replace __v/__c
    if(safe(str)) {
        if(str.includes('__c')) {
            str = str.replace('__c', '');
        } else if(str.includes('__v')) {
            str = str.replace('__v', '');
        }

        const words = str.split('_'); // Split the string into an array of words
        const capitalizedWords = words.map(word => {
            if (word.length === 0) {
                return ''; // Handle empty words
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize first letter and lowercase the rest
        });
        return capitalizedWords.join(' '); // Join the words back into a string
    }
    return '';
}

