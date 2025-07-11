import React, { type ChangeEventHandler } from 'react'

interface CBToggle {
	isChecked: boolean
	label: string
	name: string
	checkHandler: ChangeEventHandler<HTMLInputElement>
}

export const CBToggle: React.FC<CBToggle> = ({
	isChecked,
	label,
	checkHandler,
	name
}) => {
	return (
		<label
			className="cb-label"
			htmlFor={name}
		>
			{label}
			<input
				className="cb-toggle"
				type="checkbox"
				id={name}
				checked={isChecked}
				onChange={checkHandler}
			/>
		</label>
	)
}
