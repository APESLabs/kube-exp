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

export const deletePod = async (namespace: string, name: string) => await kube.delete(
    `/api/v1/namespaces/${namespace}/pods?fieldSelector=metadata.name=${name}`
)

export const listDeployments = async (namespace: string) => await kube.get(`/apis/apps/v1/namespaces/${namespace}/deployments`);

export const deleteDeployment = async (namespace: string, name: string) => await kube.delete(
    `/apis/apps/v1/namespaces/${namespace}/deployments?fieldSelector=metadata.name=${name}`
);

export const listDaemonsets = async (namespace: string) => await kube.get(`/apis/apps/v1/namespaces/${namespace}/daemonsets`);

export const deleteDaemonset = async (namespace: string, name: string) => await kube.delete(
    `/apis/apps/v1/namespaces/${namespace}/daemonsets?fieldSelector=metadata.name=${name}`
);

export const listJobs = async (namespace: string) => await kube.get(`/apis/batch/v1/namespaces/${namespace}/jobs`);

export const deleteJob = async (namespace: string, name: string) => await kube.delete(
    `/apis/batch/v1/namespaces/${namespace}/jobs?fieldSelector=metadata.name=${name}`
);

export const listCronJobs = async (namespace: string) => await kube.get(`/apis/batch/v1/namespaces/${namespace}/cronjobs`);

export const deleteCronJob = async (namespace: string, name: string) => await kube.delete(
    `/apis/batch/v1/namespaces/${namespace}/cronjobs?fieldSelector=metadata.name=${name}`
);

