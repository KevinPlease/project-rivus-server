interface IDispatcher {
	dispatch<T>(event: string, arg?: T): Promise<void>;
	dispatchOnce<T>(event: string, arg?: T | undefined): Promise<any>;
}

export default IDispatcher;
