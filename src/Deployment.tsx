import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Notification, Table } from "@douyinfe/semi-ui";
import { IconDelete } from "@douyinfe/semi-icons";

import * as KubeAPI from './kube-api'

export default function Deployment() {
    const [resources, setResources] = useState([] as any[]);
    
    const syncResources = async (namespace: string) => {
        const response = await KubeAPI.listDeployment(namespace);
        setResources(response.data.items);   
    };

    const [searchParams, setSearchParams] = useSearchParams();
    if (searchParams.get('namespace') === null) {
        setSearchParams({ namespace: 'default' });
    }
    const namespace: string = searchParams.get('namespace') as string;

    useEffect(() => {
        syncResources(namespace);  
    }, [namespace])

    const handleDelete = (namespace: string, name: string) => {
        (async () => {
            const response = await KubeAPI.deleteDeployment(namespace, name);
            Notification.open({
                type: response.status < 400 ? 'info' : 'error',
                title: `删除${response.status < 400 ? '成功' : '失败'}`,
                content: name,
                duration: 1,
                onClose: () => window.location.reload()
            });                           
        })()
    }

    const columns = [
        {title: '名字空间', dataIndex: "metadata.namespace"},
        {title: '名称',dataIndex: "metadata.name"},
        {
            title: '镜像',
            render: (text: any, record: any, index: number) => {
                const containers: any[] = record.spec.template.spec.containers;
                return (
                    <ul>
                        {containers.map(item => (<li key={item.name}>{item.image}</li>))}
                    </ul>
                )
            }
        },
        {
            title: '状态',
            render: (text: any, record: any, index: number) => {
                const { readyReplicas, replicas } = record.status;
                return (
                    <span>{`${readyReplicas}/${replicas}`}</span>
                )
            }
        },
        {title: '创建时间', dataIndex: "metadata.creationTimestamp"},
        {
            title: '操作',
            render: (text: any, record: any, index: number) => {
                const { namespace, name } = record.metadata;
                return (
                    <span>
                        <Button type={'danger'} icon={<IconDelete />} onClick={() => handleDelete(namespace, name)}/>
                    </span>
                );
            }   
        }
    ];
    
    return (
        <Table pagination={false} columns={columns} dataSource={resources}/>
    )   
}