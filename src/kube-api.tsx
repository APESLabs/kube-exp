import axios from "axios";

const kube = axios.create({
    headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_TOKEN}`
    }
});

export const listNodes = async () => await kube.get(`/api/v1/nodes`);

export const listNamespaces = async () => await kube.get(`/api/v1/namespaces`);

export const listPods = async (namespace: string) => await kube.get(`/api/v1/namespaces/${namespace}/pods`);

export const createPod = async (namespace: string, object: any) => await kube.post(`/api/v1/namespaces/${namespace}/pods`, object)

export const deletePod = async (namespace: string, name: string) => await kube.post(
    `/api/v1/namespaces/${namespace}/pods?fieldSelector=metadata.name=${name}`
)