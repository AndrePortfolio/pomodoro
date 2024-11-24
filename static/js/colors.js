// Function to get the value of a CSS variable
function getCSSVariableValue(variableName) {
	const root = document.documentElement;
	return getComputedStyle(root).getPropertyValue(variableName).trim();
}

// Retrieve color values from CSS
const chillColor = getCSSVariableValue('--grey-color');
const sleepColor = getCSSVariableValue('--darkblue-color');
const workColor = getCSSVariableValue('--red-color');
const greenColor = getCSSVariableValue('--green-color');
