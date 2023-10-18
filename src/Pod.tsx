import { useContext, useEffect, useState } from "react";
import { Button, Notification, Table } from "@douyinfe/semi-ui";
import { IconDelete } from "@douyinfe/semi-icons";

import { NamespaceContext } from "./context";
import { listPods, deletePod } from './kube-api'


export default function Pod() {
    const [pods, setPods] = useState([] as any[]);
    const namespace = useContext(NamespaceContext);

    const syncPods = async (namespace: string) => {
        const response = await listPods(namespace);
        setPods(response.data.items);   
    }

    useEffect(() => {
        syncPods(namespace);  
    }, [namespace])

    const columns = [
        {title: '名字空间', dataIndex: "metadata.namespace"},
        {title: '名称',dataIndex: "metadata.name"},
        {title: '节点', dataIndex: "spec.nodeName"},
        {title: '创建时间', dataIndex: "metadata.creationTimestamp"},
        {title: '状态', dataIndex: "status.phase"},
        {
            title: '操作',
            render: (text: any, record: any, index: number) => {
                return (
                    <span>
                        <Button type={'danger'} icon={<IconDelete />} onClick={() => {
                            (async ({ metadata }) => {
                                const { namespace, name } = metadata;
                                const response = await deletePod(namespace, name);
                                Notification.open({
                                    type: response.status < 400 ? 'info' : 'error',
                                    title: `删除${response.status < 400 ? '成功' : '失败'}`,
                                    content: name,
                                    duration: 1,
                                    onClose: () => syncPods(namespace)
                                });                           
                            })(record)
                        }} />
                    </span>
                );
            }   
        }
    ];

    return (
        <Table pagination={false} columns={columns} dataSource={pods}/>
    )
}