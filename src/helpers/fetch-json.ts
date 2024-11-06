export async function fetchJSON(path: string) {
  const response = await fetch(path, {
    headers: { Authorization: "Basic " + btoa("admin:admin") },
  });
  if (!response.ok) {
    throw response.text();
  }
  const data = await response.json();
  return data.result; // DEBT andrebbe restituito solo data, al massimo andrebbe chiamata diversamente questa funzione
}

export async function fetchPostJSON(path: string, params?: object) {
  const response = await fetch(path, {
    headers: { Authorization: "Basic " + btoa("admin:admin"), "Content-Type": "application/json; charset=UTF-8" },
    method: "POST",
    body: params ? JSON.stringify(params) : "",
  });
  if (!response.ok) {
    throw response.json();
  }
  const data = await response.json();
  return data.result; // DEBT andrebbe restituito solo data, al massimo andrebbe chiamata diversamente questa funzione
}

export async function fetchJSONplain(path: string) {
  const response = await fetch(path, {
    headers: { Authorization: "Basic " + btoa("admin:admin") },
  });
  if (!response.ok) {
    throw response.json();
  }
  const data = await response.json();
  return data;
}

export async function fetchPostJSONplain(path: string, params?: object) {
  const response = await fetch(path, {
    headers: { Authorization: "Basic " + btoa("admin:admin"), "Content-Type": "application/json" },
    method: "POST",
    body: params ? JSON.stringify(params) : "",
  });
  if (!response.ok) {
    throw response.json();
  }
  const data = await response.json();
  return data;
}
