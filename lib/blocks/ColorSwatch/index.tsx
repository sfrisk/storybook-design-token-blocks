import React from 'react'
import tinycolor from 'tinycolor2'
import './color-swatch.css'
import '../Toggle'
import { CBToggle } from '../Toggle'

const BLACK = '#000000'
const WHITE = '#ffffff'

interface ColorSwatchProps {
	title: string
	cssVar: string
	condensed: boolean
}

function getComputedColorValue(variableName: string) {
	return getComputedStyle(document.documentElement)
		.getPropertyValue(variableName)
		.trim()
}

function getGrade(bgColor: string, textColor: string, size: 'small' | 'large') {
	if (
		tinycolor.isReadable(bgColor, textColor, {
			level: 'AAA',
			size: size
		})
	) {
		return (
			<span>
				<span aria-hidden={true}>✅ </span>
				<span className="sr-only">Accessibility Contrast</span>
				<abbr title="WCAG Level AAA - Excellent Accessibility">AAA</abbr> Passes
			</span>
		)
	}
	if (
		tinycolor.isReadable(bgColor, textColor, {
			level: 'AA',
			size: size
		})
	) {
		return (
			<span>
				<span aria-hidden={true}>⚠️ </span>
				<span className="sr-only">Accessibility Contrast</span>
				<abbr title="WCAG Level AA - Strong Accessibility">AA</abbr> Passes
			</span>
		)
	}
	return (
		<span>
			<span aria-hidden={true}>⛔ </span>
			<span className="sr-only">Accessibility Contrast</span>
			Fails
		</span>
	)
}

function getGrades(bgColor: string, textColor: string, title: string) {
	return {
		readability: tinycolor.readability(bgColor, textColor).toFixed(2),
		small: getGrade(bgColor, textColor, 'small'),
		large: getGrade(bgColor, textColor, 'large'),
		title: title
	}
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
	title,
	cssVar,
	condensed = false
}) => {
	const colorValue = getComputedColorValue(cssVar)

	const contrasts = [
		getGrades(colorValue, WHITE, 'White'),
		getGrades(colorValue, BLACK, 'Black')
	]

	const useLight = tinycolor.isReadable(colorValue, WHITE, {
		level: 'AA',
		size: 'small'
	})

	return (
		<div
			className={`sb-unstyled color-swatch ${
				useLight ? 'light-text' : 'dark-text'
			} ${condensed ? 'color-swatch--condensed' : ''}`}
			style={{ background: colorValue }}
		>
			<h3 className="color-swatch__header">{title}</h3>
			<div className="color-swatch__subheader">
				<span className="sr-only">CSS Variable Name:</span>
				<em>var({cssVar}): </em>
				<span className="sr-only">Color Value:</span>

				<strong>{colorValue || 'Not found'}</strong>
			</div>

			{condensed ? (
				''
			) : (
				<div
					role="table"
					className="color-swatch__table"
					aria-label={`${title}: Accessibility Documentation`}
				>
					<div
						role="row"
						className="color-swatch__row"
					>
						<div
							className="color-swatch__title"
							role="rowheader"
						>
							Text Size
						</div>
						<div
							className="color-swatch__large-text"
							role="columnheader"
						>
							<span className="sr-only">Large Text</span>
							<span aria-hidden={true}>Aa</span>
						</div>
						<div
							className="color-swatch__small-text"
							role="columnheader"
						>
							<span className="sr-only">Small Text</span>
							<span aria-hidden={true}>Aa</span>
						</div>
					</div>
					{contrasts.map((item) => (
						<div
							role="row"
							className="color-swatch__row"
						>
							<div
								className="light-text color-swatch__title"
								role="rowheader"
							>
								{item.title} ({item.readability})
							</div>
							<div>
								<span
									className="color-swatch__badge"
									role="cell"
								>
									{item.large}
								</span>
							</div>
							<div>
								<span
									className="color-swatch__badge"
									role="cell"
								>
									{item.small}
								</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

interface ColorSwatchesProps {
	title: string
	colors?: { [key: string]: string }
	condensed?: boolean
	children?: React.ReactNode
}

export const ColorSwatches: React.FC<ColorSwatchesProps> = ({
	children,
	colors,
	condensed = false,
	title
}) => {
	const [isVerboseChecked, setIsVerboseChecked] = React.useState(!condensed)

	const checkboxId = `${title.replace(/\s+/g, '')}-isCondensed`

	const checkHandler = () => {
		setIsVerboseChecked(!isVerboseChecked)
	}

	const swatches = colors
		? Object.keys(colors).map((key) => {
				return (
					<ColorSwatch
						condensed={!isVerboseChecked}
						title={`${title} ${key}`}
						cssVar={colors[key]}
						key={key}
					/>
				)
		  })
		: null
	return (
		<div>
			<div className="color-swatches__header">
				<h2>{title}</h2>
				<CBToggle
					label="Show Verbose"
					name={checkboxId}
					isChecked={isVerboseChecked}
					checkHandler={checkHandler}
				/>
			</div>

			{children}

			<div
				className={`color-swatches ${
					isVerboseChecked ? '' : 'color-swatches--condensed'
				}`}
			>
				{swatches}
			</div>
		</div>
	)
}
