import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 10, 
  duration: "30s",
};

const BASE_URL = "http://localhost:4000";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqdWFzc25AdGVzdC5jb20iLCJyb2wiOjEsImlhdCI6MTc1ODUwNDI5MSwiZXhwIjoxNzU4NTA3ODkxfQ.N4pe2ODL--t83LAS928a-Js--B-W5gRcNSJmwiCF6eU"; // pega tu JWT

export default function () {
  let res = http.get(`${BASE_URL}/denuncias`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  check(res, {
    "status es 200": (r) => r.status === 200,
    "respuesta contiene JSON": (r) => r.headers["Content-Type"]?.includes("application/json"),
  });

  sleep(1);
}
