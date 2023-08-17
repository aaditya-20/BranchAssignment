export const toastOption = {
	position: "bottom-right",
	autoClose: 3000,
	pauseOnHover: true,
	theme: "dark",
};
export const promiseToaster = {
	pending: {
		render() {
			return "Processing Request";
		},
	},
	success: {
		render({ data }) {
			return `Successfully ${data} 👌`;
		},
	},
	error: {
		render({ data }) {
			return `${data}`;
		},
	},
};