import configuration from "src/helpers/configuration";

export function isExpiredDate(date: Date) {
  const today = new Date();
  return date.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0);
}

export function isValidDate(date: Date) {
  const today = new Date();
  return date.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0);
}

export const isDateFormatValid = (inputToValidate: string) => {
  const pattern = /(^[0123]?$)|(^(0[1-9]|[12][0-9]|3[01])$)|(^(0[1-9]|[12][0-9]|3[01])\/([01]?)$)|(^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])(\/)?$)|(^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(\d+))/;

  return pattern.test(inputToValidate);
};

export const formatDate = (text: string) => {
  if (text.length === 3 && text.charAt(2) === "/") {
    return text;
  }
  if (text.length === 6 && text.charAt(5) === "/") {
    return text;
  }

  const input = text.replaceAll("/", "");

  if (input.length < 3) {
    const pattern = /(\d{2})(\d+)/;

    return text.replace(pattern, "$1/$2");
  } else if (input.length < 5) {
    const pattern = /(\d{2})(\d{0,2})/;

    return input.replace(pattern, "$1/$2");
  } else {
    const pattern = /(\d{2})(\d{2})(\d)/;

    return input.replace(pattern, "$1/$2/$3");
  }
};

export const expirationDateCheck = (dateToValidate: string) => {
  //dateToValidate format:dd/mm/yyyy
  const splittedDate = dateToValidate.split(/\D/);
  const reversedDate = splittedDate.reverse().join("-");
  const dateDocDataScad = new Date(reversedDate);
  return isExpiredDate(dateDocDataScad);
};
export const existDate = (dateToValidate: string) => {
  //dateToValidate format:dd/mm/yyyy

  const pattern31day = /^(0[1-9]|1[0-9]|2[0-9]|3[01])\/(0[13578]|1[02])\/(\d{4})$/;
  const pattern30day = /^(0[1-9]|1[0-9]|2[0-9]|30)\/(0[469]|11)\/(\d{4})$/;
  const pattern29day = /^(0[1-9]|1[0-9]|2[0-9])\/(02)\/(\d{4})$/;

  return pattern31day.test(dateToValidate) || pattern30day.test(dateToValidate) || pattern29day.test(dateToValidate);
};
export const validityDateCheck = (dateToValidate: string) => {
  //dateToValidate format:dd/mm/yyyy

  if (dateToValidate.length === 0) {
    return true;
  }

  if (existDate(dateToValidate)) {
    const splittedDate = dateToValidate.split(/\D/);
    const reversedDate = splittedDate.reverse().join("-");
    const dateDocDataScad = new Date(reversedDate);
    if (dateDocDataScad) {
      return isValidDate(dateDocDataScad);
    } else {
      return false;
    }
  }

  return false;
};

export const getReversedDate = (date: string) => {
  const splittedDate = date.split(/\D/);
  const reversedDate = splittedDate.reverse().join("-");
  return reversedDate;
};
