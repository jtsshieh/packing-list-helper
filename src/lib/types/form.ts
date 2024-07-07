export type FormResult = {
	type: 'error' | 'success';
	message: string;
};

export type FormAction = (
	prevState: FormResult | null,
	formData: FormData,
) => FormResult | Promise<FormResult>;
