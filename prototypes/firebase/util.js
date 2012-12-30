function isEmptyObj(obj) {
	for (el in obj) {
		if (obj.hasOwnProperty(el)) {
			return false;
		}
	}
	return true;
}