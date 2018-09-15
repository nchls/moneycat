export const InputField = ({ id, type, label, helpText, errorText }) {
	return (
		<div className="field">
			<label className="label" for={id}>{ label }</label>
			<div className="control">
				<input id={id} type={type} value={value} />
				{ helpText && <div className="help">{ helpText }</div> }
				{ errors && <div className="help is-danger">{ errorText }</div> }
			</div>
		</div>
	);
}
