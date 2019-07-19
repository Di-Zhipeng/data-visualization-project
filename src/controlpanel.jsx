import React from "react"
import "../node_modules/antd/dist/antd.css"
import { Col, Row, Empty, message, Button, Layout, Menu, Breadcrumb, Icon, Switch, Statistic, Drawer } from "antd"
import Snapshots from "./snapshots"
import Graph from "./graph"
import Degrees from "./degrees"
import WYP from "./WYP.svg"
class Controlpanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            theme: 'light',
            current: '1',
            visible: false,

        };
    }
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    }

    onClose = () => {
        this.setState({
            visible: false,
        });
    };


    changeTheme = value => {
        this.setState({
            theme: value ? 'dark' : 'light',
        });
    };


    handleClick1 = (e) => {
        this.props.changeDataSet(e.key)
    }
    handleClick2 = (e) => {
        if (e.key === "day" || e.key === "all") {
            this.props.changeDyeMethod(e.key)
        }
        else if ((e.key === "pca") || (e.key === "tsne") || e.key === "tsne-z") {
            this.props.changeAlgorithm(e.key)
        }
    }


    render() {
        const info = () => {
            message.info('这个Snapshot的每个点度均为0');
        };


        const empty = <Empty
            imageStyle={{
                height: 300,
                marginTop: 90
            }}
            description={
                <span>
                    <Button type="primary" onClick={info}>
                        What Happened?
                </Button>
                </span>
            }
        >
        </Empty>


        const { SubMenu } = Menu;
        const { Header, Content, Footer, Sider } = Layout;
        return (
            <Layout>

                <Header className="header"
                    style={{
                        marginLeft: -50,
                        background: '#fff'
                    }}>
                    <Row>
                        <Col span={2}>
                            <Button
                                style={{
                                    height: 64
                                    // borderRadius:0
                                }}
                                block={true}
                                type="primary"
                                onClick={this.showDrawer}
                                icon="menu"
                            >
                                MENU
                            </Button>
                            <Menu
                                theme={this.state.theme}
                                mode="horizontal"
                                defaultSelectedKeys={['highschool']}
                                style={{ lineHeight: '64px' }}
                                onClick={this.handleClick1}
                            >

                            </Menu>
                        </Col>
                        <Col span={22}>
                            <Menu
                                theme={this.state.theme}
                                mode="horizontal"
                                defaultSelectedKeys={['highschool']}
                                style={{ lineHeight: '64px' }}
                                onClick={this.handleClick1}
                            >
                                <Menu.Item key="highschool">Highschool</Menu.Item>
                                <Menu.Item key="workplace">Workplace</Menu.Item>
                            </Menu>
                        </Col>
                    </Row>



                </Header>


                <Layout>


                    <div style={{ width: 256 }}>
                        <Drawer
                            title="Control Panel"
                            placement="left"
                            closable={false}
                            onClose={this.onClose}
                            visible={this.state.visible}

                        >
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['降维算法']}
                                defaultOpenKeys={['pca']}
                                style={{ width: 250, marginLeft: -20, borderRight: 0 }}
                                theme={this.state.theme}
                                onClick={this.handleClick2}

                            >


                                <SubMenu
                                    key="降维算法"
                                    title={
                                        <span>
                                            <Icon type="user" />
                                            降维算法
                                        </span>
                                    }
                                >
                                    <Menu.Item key="pca">PCA降维算法</Menu.Item>
                                    <Menu.Item key="tsne">t-SNE降维算法</Menu.Item>
                                    <Menu.Item key="tsne-z">t-SNE降维算法(预处理)</Menu.Item>

                                </SubMenu>
                                <SubMenu
                                    key="染色方法"
                                    title={
                                        <span>
                                            <Icon type="laptop" />
                                            染色方法
                                        </span>
                                    }
                                >
                                    <Menu.Item key="day">按天染色</Menu.Item>
                                    <Menu.Item key="all">按总时长染色</Menu.Item>

                                </SubMenu>
                            </Menu>
                        </Drawer>
                    </div>

                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Breadcrumb style={{ padding: '16px 16px' }} separator="-">

                            <Breadcrumb.Item>{this.props.DataSet}</Breadcrumb.Item>
                            <Breadcrumb.Item>{this.props.Algorithm}</Breadcrumb.Item>
                            <Breadcrumb.Item>{this.props.DyeMethod}</Breadcrumb.Item>


                        </Breadcrumb>

                        <Row>
                            <Col span={4}>
                                <Row span={4}>
                                    <Layout>
                                        <Content style={{
                                            background: '#fff',
                                            paddingLeft: 0,
                                            paddingBottom: 6,
                                            margin: 10,
                                            height: document.body.clientHeight * 0.3
                                        }}>
                                            <Degrees snapshots={this.props.snapshots} graphID={this.props.graphID} changeEmpty={this.props.changeEmpty} empty={this.props.empty} />
                                        </Content>
                                    </Layout>
                                </Row>
        

                            </Col>

                            <Col span={10}>
                                <Layout>
                                    <Content style={{
                                        background: '#fff',
                                        padding: 0,
                                        margin: 10,
                                        height: document.body.clientHeight * 0.8
                                    }}>
                                        <Snapshots snapshots={this.props.snapshots} changeGraphID={this.props.changeGraphID} DyeMethod={this.props.DyeMethod} empty={this.props.empty} DataSet={this.props.DataSet}/>
                                    </Content>
                                </Layout>

                            </Col>
                            <Col span={10}>
                                <Layout>
                                    <Content style={{
                                        background: '#fff',
                                        margin: 10,
                                        height: document.body.clientHeight * 0.8
                                    }}>
                                        {this.props.empty && empty}
                                        <Graph graph={this.props.graph} classinfo={this.props.classinfo} display={!this.props.empty} DataSet={this.props.DataSet} />
                                    </Content>
                                </Layout>
                            </Col>
                        </Row>





                        {/* <Content style={{
                            background: '#fff',
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                        }}>
                            <div className="App">
                                <Row>
                                    <Col span={6}>
                                        <Degrees snapshots={this.props.snapshots} graphID={this.props.graphID} changeEmpty={this.props.changeEmpty} empty={this.props.empty} />
                                    </Col>
                                    <Col span={10}>
                                        <Snapshots snapshots={this.props.snapshots} changeGraphID={this.props.changeGraphID} DyeMethod={this.props.DyeMethod} empty={this.props.empty} />
                                    </Col>
                                    <Col span={8}>
                                        {graph}
                                    </Col>
                                </Row>
                            </div>

                        </Content> */}
                    </Layout>
                </Layout>

                <Footer style={{ textAlign: 'center' }}>Project of ZJU Vis Summer Course ©2019 Created by Tenderness Dream Wahr</Footer>
            </Layout>

        )
    }
}


export default Controlpanel