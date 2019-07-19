import React from "react"
import * as d3 from "d3"
import "../node_modules/antd/dist/antd.css"
import { Col, Row, Empty, message, Button, Layout, Menu, Breadcrumb, Icon } from "antd"
import Snapshots from "./snapshots"
import Graph from "./graph"
import Degrees from "./degrees"
import Controlpanel from "./controlpanel"
class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            snapshots: [],
            graph: {},
            graphID: undefined,
            classinfo: {},

            empty: false,

            Algorithm: "pca",
            DyeMethod: "day",
            DataSet: "highschool",
        }

    }

    componentDidMount() {
        d3.json("./highschool-pca.json").then(snapshots => {
            this.setState({
                snapshots: snapshots,
                graph: snapshots[0].graph,
                graphID: 0
            })
        }).then(() => {
            // reading classinfo after former files
            d3.json("./id-class.json").then(classinfo => {
                this.setState({
                    classinfo: classinfo
                })
            })
        })

    }
    componentDidUpdate(prevProps, prevState) {

        if ((this.state.Algorithm !== prevState.Algorithm) || (this.state.DataSet !== prevState.DataSet)) {
            console.log("didUpdate")
            d3.json("./" + this.state.DataSet + "-" + this.state.Algorithm +".json").then(snapshots => {
                this.setState({
                    snapshots: snapshots,
                    graph: snapshots[0].graph,
                    graphID: 0
                })
            }).then(() => {
                // reading classinfo after former files
                if (this.state.DataSet === "highschool") {
                    d3.json("./id-class.json").then(classinfo => {
                        this.setState({
                            classinfo: classinfo
                        })
                    })
                }
                else {
                    d3.json("./id-department.json").then(classinfo => {
                        this.setState({
                            classinfo: classinfo
                        })
                    })
                }

            })
        }




    }

    changeGraphID = (value) => {
        this.setState(
            {
                graphID: value,
                graph: this.state.snapshots[value].graph
            }
        )
    }

    changeAlgorithm = (value) => {
        this.setState(
            {
                Algorithm: value
            }
        )
    }
    changeDyeMethod = (value) => {
        this.setState(
            {
                DyeMethod: value
            }
        )
    }
    changeDataSet = (value) => {
        this.setState(
            {
                DataSet: value
            }
        )
    }
    changeEmpty = (value) => {
        this.setState(
            {
                empty: value
            }
        )
    }

    render() {


        return (



            // <Col span={4}>
            //     <Row span={8}>
            //         <Degrees snapshots={this.state.snapshots} graphID={this.state.graphID} changeEmpty={this.changeEmpty} empty={this.state.empty} />
            //     </Row>
            //     <Row span={12}>
            //         <Controlpanel changeAlgorithm={this.changeAlgorithm} changeDyeMethod={this.changeDyeMethod} changeDataSet={this.changeDataSet} />
            //     </Row>
            // </Col>



            <Controlpanel  changeAlgorithm={this.changeAlgorithm} changeDyeMethod={this.changeDyeMethod} changeDataSet={this.changeDataSet} changeGraphID={this.changeGraphID} changeEmpty={this.changeEmpty} DataSet={this.state.DataSet} Algorithm={this.state.Algorithm} DyeMethod={this.state.DyeMethod} snapshots={this.state.snapshots} graph={this.state.graph} empty={this.state.empty} classinfo={this.state.classinfo} graphID={this.state.graphID} />



        )
    }
}


export default App
