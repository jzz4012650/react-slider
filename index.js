import "./index.less";
import React, { Component } from 'react';

class Slider extends Component {

    constructor(props) {
        super(props);
        this.inTransition = false;
        this.count = this.props.children.length || [this.props.children].length;
        this.state = {
            lastIndex: (0 - 1) % this.count,
            activeIndex: 0,
            nextIndex: (0 + 1) % this.count
        }
    }

    componentDidMount() {
        let content = this.refs.content;
        this.width = this.props.width || content.getBoundingClientRect().width;
        this.autoPlay();
    }

    handleTransitionEnd() {
        this.inTransition = false;
    }

    handleSlideChange(i) {
        if (!this.inTransition && this.state.activeIndex !== i) {
            clearInterval(this.timer);
            this.setState({
                nextIndex: i
            });
            requestAnimationFrame(() => {
                this.inTransition = true;
                this.setState({
                    lastIndex: this.state.activeIndex,
                    activeIndex: i,
                    nextIndex: (i + 1) % this.count
                });
                this.autoPlay();
            })
        }
    }

    autoPlay() {
        if (this.props.autoPlay) {
            this.timer = setInterval(() => {
                this.inTransition = true;
                this.setState({
                    lastIndex: this.state.activeIndex,
                    activeIndex: (this.state.activeIndex + 1) % this.count,
                    nextIndex: (this.state.activeIndex + 2) % this.count
                });
            }, this.props.interval);
        }
    }

    getStyle(index) {
        switch(index) {
            case this.state.activeIndex:
                return { transform: `translate3d(0, 0, 0)`, display: "block" }
            case this.state.lastIndex:
                return this.state.lastIndex > this.state.activeIndex ?
                    { transform: `translate3d(${+this.width}px, 0, 0)`, display: "block" } :
                    { transform: `translate3d(${-this.width}px, 0, 0)`, display: "block" }
            case this.state.nextIndex:
                return this.state.nextIndex > this.state.activeIndex ?
                    { transform: `translate3d(${+this.width}px, 0, 0)`, transition: "none", display: "block" } :
                    { transform: `translate3d(${-this.width}px, 0, 0)`, transition: "none", display: "block" }
            default:
                return { display: "none" }
        }
    }

    render() {
        let { children } = this.props;
        return (
            <div className="slider-wrapper" ref="wrapper">
                <div className="slider-content" ref="content">
                    {(Array.isArray(children) ? children : [children]).map((d, i) => (
                        <div className="slider-item"
                            style={this.getStyle(i)}
                            onTransitionEnd={this.handleTransitionEnd.bind(this)}>{d}</div>
                    ))}
                </div>
                <div className="slider-ctrl-wrapper">
                    {(Array.isArray(children) ? children : [children]).map((d, i) => {
                        return (
                            <span className={"slider-ctrl" + (i === this.state.activeIndex ? " active" : "")}
                                onClick={this.handleSlideChange.bind(this, i)}/>
                        )
                    })}
                </div>
            </div>
        );
    }
}

Slider.defaultProps = {
    width: null,
    interval: 3000,
    autoPlay: true
}

export default Slider;
