import { fetchMock } from "../mocks/fetchMock";
import { fetchIntercept } from "../mocks/fetchIntercept";
import { APIResponseType } from "../types/apiResponse.types";

export const ApiService = () => {
  const handleErrors = (response: any) => {
    if (!response.ok) {
      return;
    }
    return response;
  };

  const get = (
    entity: string,
    id: number | string,
    HttpOptions?: RequestInit,
    mustIntercept = false,
  ): Promise<APIResponseType<any>> => {
    if (process.env.REACT_APP_OFFLINE_MODE === "false") {
      return fetch(`${process.env.REACT_APP_ENDPOINT}/${entity}/${id}`, {
        method: "GET",
        headers: { Authorization: "Basic " + btoa("admin:admin") },
        ...{ HttpOptions },
      })
        .then(handleErrors)
        .then((response) => fetchIntercept(entity, response.json()));
    }
    // @ts-ignore
    return Promise.resolve({ result: fetchMock[entity][id] });
  };

  const post = (entity: string, data: object): Promise<APIResponseType<any>> => {
    const ac = new AbortController();
    if (process.env.REACT_APP_OFFLINE_MODE === "false") {
      return fetch(`${process.env.REACT_APP_ENDPOINT}/${entity}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Basic " + btoa("admin:admin") },
        body: JSON.stringify(data),
        signal: ac.signal,
      })
        .then(handleErrors)
        .then((response) => fetchIntercept(entity, response.json()));
    }

    // @ts-ignore
    const fetchedEntity = fetchMock[entity];
    return Promise.resolve({
      result:
        fetchedEntity !== undefined ? [fetchedEntity[Math.floor(fetchedEntity.length * Math.random())]] : fetchedEntity,
    });
  };

  return { get, post };
};
