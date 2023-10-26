import axios from 'axios';

const kube = axios.create({
    headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_TOKEN}`
    }
});

export const buildGVKForURL = (apiVersion: string, kind: string) => {
    if (apiVersion === 'v1') {
        return {group: '', version: 'v1', kind: `${kind.toLowerCase()}s`};
    } else {
        const [group, version] = apiVersion.split('/')
        return {group , version, kind: `${kind.toLowerCase()}s`};
    }
}

const buildURL = (group: string, version: string, kind: string, namespace: string) => {
    const apiPrefix = group === '' ? `api/${version}` : `apis/${group}/${version}`;
    return namespace === '' ? `/${apiPrefix}/${kind}` : `/${apiPrefix}/namespaces/${namespace}/${kind}`;
}

export const listResource = async (group: string, version: string, kind: string, namespace: string) => {
    return await kube.get(buildURL(group, version, kind, namespace));
}

export const createResource = async (group: string, version: string, kind: string, namespace: string, object: any) => {
    return await kube.post(buildURL(group, version, kind, namespace), object);
}

export const deleteResource = async (group: string, version: string, kind: string, namespace: string, name: string) => {
    return await kube.delete(`${buildURL(group, version, kind, namespace)}?fieldSelector=metadata.name=${name}`);
}

export const listNodes = async () => await listResource('', 'v1', 'nodes', '');
export const listNamespaces = async () => await listResource('', 'v1', 'namespaces', '');

export const listPods = async (namespace: string) => await listResource('', 'v1', 'pods', namespace);
export const createPod = async (namespace: string, object: any) => await createResource('', 'v1', 'pods', namespace, object);
export const deletePod = async (namespace: string, name: string) => await deleteResource('', 'v1', 'pods', namespace, name);

export const listDeployment = async (namespace: string) => await listResource('apps', 'v1', 'deployments', namespace);
export const createDeployment = async (namespace: string, object: any) => await createResource('apps', 'v1', 'deployments', namespace, object);
export const deleteDeployment = async (namespace: string, name: string) => await deleteResource('apps', 'v1', 'deployments', namespace, name);

export const listDaemonSet = async (namespace: string) => await listResource('apps', 'v1', 'daemonsets', namespace);
export const createDaemonSet = async (namespace: string, object: any) => await createResource('apps', 'v1', 'daemonsets', namespace, object);
export const deleteDaemonSet = async (namespace: string, name: string) => await deleteResource('apps', 'v1', 'daemonsets', namespace, name);

export const listStatefulSet = async (namespace: string) => await listResource('apps', 'v1', 'statefulsets', namespace);
export const createStatefulSet = async (namespace: string, object: any) => await createResource('apps', 'v1', 'statefulsets', namespace, object);
export const deleteStatefulSet = async (namespace: string, name: string) => await deleteResource('apps', 'v1', 'statefulsets', namespace, name);

export const listCronJob = async (namespace: string) => await listResource('batch', 'v1', 'cronjobs', namespace);
export const createCronJob = async (namespace: string, object: any) => await createResource('batch', 'v1', 'cronjobs', namespace, object);
export const deleteCronJob = async (namespace: string, name: string) => await deleteResource('batch', 'v1', 'cronjobs', namespace, name);

export const listJob = async (namespace: string) => await listResource('batch', 'v1', 'jobs', namespace);
export const createJob = async (namespace: string, object: any) => await createResource('batch', 'v1', 'jobs', namespace, object);
export const deleteJob = async (namespace: string, name: string) => await deleteResource('batch', 'v1', 'jobs', namespace, name);


