import {useState, useEffect} from 'react'
import {getAllStudents, deleteStudent} from "./client";
import {errorNotification, successNotification} from "./components/Notification";

import {
    Layout,
    Menu,
    Breadcrumb,
    Table,
    Spin,
    Empty,
    Button, Tag, Badge, Space, Popconfirm, message, Radio
} from 'antd';

import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    LoadingOutlined,
    PlusOutlined
} from '@ant-design/icons';
import StudentDrawerForm from "./components/StudentDrawerForm";

import './App.css';

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;
const {Column, ColumnGroup} = Table;

const removeStudent = (studentId, callback) => {
    deleteStudent(studentId).then(() => {
        successNotification("user deleted", "user deleted");
        callback(); //callback is fetchStudent, from 'onConfirm' at Popconfirm
    }).catch(err => {
        console.log(err.response);
        err.response.json().then(res => {
            console.log(res);
            errorNotification("error", `${res.message} [statusCode:${res.status}`) //alert with from antd Notification
        })
    });
}

const columns = fetchStudents => [
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Actions',
        key: 'Id',
        render: (text, student) =>
            <Radio.Group>
                <Popconfirm
                    placement='topRight'
                    title={`delete ${student.name}?`}
                    onConfirm={() => removeStudent(student.id, fetchStudents)}
                    okText='Yes'
                    cancelText='No'
                >
                    <Radio.Button value="small">Delete</Radio.Button>
                </Popconfirm>
                <Radio.Button value="small">Edit</Radio.Button>
            </Radio.Group>
    }

];


// loading spin
const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;

function App() {
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);

    //fetch student list and update state
    const fetchStudents = () =>
        getAllStudents()
            .then(res => res.json())
            .then(data => {
                setStudents(data); //render student list to screen
            }).catch(err => {
            console.log(err.response);
            err.response.json().then(res => {
                console.log(res);
                errorNotification("error", `${res.message} [statusCode:${res.status}`) //alert with from antd Notification
            })
        }).finally(() => setFetching(false));


    useEffect(() => {
        console.log("component is mounted");
        fetchStudents();
    }, []);

    // make separate component
    const renderStudents = () => {
        if (fetching) {
            return <Spin indicator={antIcon}/>
        }
        if (students.length <= 0) {
            return <>
                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                    Add New Users
                </Button>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}/>
                <Empty />
            </>
        }
        return <>
            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}
            />
            <Table
                dataSource={students}
                columns={columns(fetchStudents)}
                bordered
                title={() =>
                    <>
                        <Button
                            onClick={() => setShowDrawer(!showDrawer)}
                            type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                            Add New Users
                        </Button>
                        <Tag>Number of users: </Tag>
                        <Badge count={students.length} className="site-badge-count-4"/>
                    </>
                }
                pagination={{pageSize: 50}}
                scroll={{y: 500}}
                rowKey={student => student.id}

            />

        </>

    }


    return (
        <div>
            <Layout style={{minHeight: '100vh'}}>
                <Sider collapsible collapsed={collapsed}
                       onCollapse={setCollapsed}>
                    <div className="logo"/>
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <Menu.Item key="1" icon={<PieChartOutlined/>}>
                            Main
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{padding: 0}}/>
                    <Content style={{margin: '0 16px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            <Breadcrumb.Item>Users</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                            {renderStudents()}
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>by diego quintela</Footer>
                </Layout>
            </Layout>
        </div>
    )
}

export default App;