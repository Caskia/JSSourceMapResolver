
/**
 * 当前环境是否为development
 */
declare var __DEV__: boolean;

/**
 * api根路径
 */
declare var __API_ROOT__: string;
/**
 * 账号服务api根路径
 */
declare var __AUTH_ROOT__: string;

declare var __PAGE_SIZE__:number;

declare var __MAP_KEY__:string;

interface Window {

}

/**
 * render之前调用，在完成首次渲染之前调用，此时仍可以修改组件的state。
 */
declare function componentWillMount(): (s) => void

/**
 * 必选的方法，创建虚拟DOM，该方法具有特殊的规则：
 *  只能通过this.props和this.state访问数据
 *  可以返回null、false或任何React组件
 *  只能出现一个顶级组件（不能返回数组）
 *  不能改变组件的状态
 *  不能修改DOM的输出
 */
declare function render(): () => any

/**
 * 真实的DOM被渲染出来后调用，在该方法中可通过this.getDOMNode()访问到真实的DOM元素。此时已可以使用其他类库来操作这个DOM。
 */
declare function componentDidMount(): () => void

/**
 * 组件接收到新的props时调用，并将其作为参数nextProps使用，此时可以更改组件props及state。
 */
declare function componentWillReceiveProps(nextProps): (nextProps) => void


/**
 * 组件是否应当渲染新的props或state，返回false表示跳过后续的生命周期方法，通常不需要使用以避免出现bug。在出现应用的瓶颈时，可通过该方法进行适当的优化。
 */
declare function shouldComponentUpdate(nextProps, nextState): (nextProps, nextState) => boolean


/**
 * 接收到新的props或者state后，进行渲染之前调用，此时不允许更新props或state。
 */
declare function componentWillUpdate(nextProps, nextState): (nextProps, nextState) => void


/**
 * 完成渲染新的props或者state后调用，此时可以访问到新的DOM元素。
 */
declare function componentDidUpdate(prevProps, prevState): (prevProps, prevState) => void


/**
 * 组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器。
 */
declare function componentWillUnmount(): () => void;
