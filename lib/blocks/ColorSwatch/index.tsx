import React from 'react'
import tinycolor from 'tinycolor2'
import './color-swatch.css'

const BLACK = '#000000'
const WHITE = '#ffffff'

interface ColorSwatchProps {
	title: string
	cssVar: string
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
				<abbr title="WCAG Level AAA - Excellent Accessibility">AAA</abbr> Pass
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

export const ColorSwatch: React.FC<ColorSwatchProps> = ({ title, cssVar }) => {
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
			className={`color-swatch ${useLight ? 'light-text' : 'dark-text'}`}
			style={{ background: colorValue }}
		>
			<div
				role="table"
				className="color-swatch__table sb-unstyled"
				aria-label={`${title}: Variable Documentation`}
			>
				<div
					role="row"
					className="color-swatch__row"
				>
					<div
						className="color-swatch__header"
						role="rowheader"
					>
						<span className="sr-only">Color Name:</span>
						{title}
					</div>
					<div
						className="color-swatch__header"
						role="cell"
					>
						<span className="sr-only">Color Value:</span>
						{colorValue || 'Not found'}
					</div>
				</div>
				<div
					role="row"
					className="color-swatch__row"
				>
					<span
						className="sr-only"
						role="rowheader"
					>
						CSS Variable Name:
					</span>

					<span role="cell">var({cssVar})</span>
				</div>
			</div>
			<div
				role="table"
				className="color-swatch__table sb-unstyled"
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
		</div>
	)
}

interface ColorSwatchesProps {
	title: string
	colors?: { [key: string]: string }
	children?: React.ReactNode
}

export const ColorSwatches: React.FC<ColorSwatchesProps> = ({
	children,
	colors,
	title
}) => {
	const swatches = colors
		? Object.keys(colors).map((key) => {
				return (
					<ColorSwatch
						title={`${title} ${key}`}
						cssVar={colors[key]}
						key={key}
					/>
				)
		  })
		: null
	return (
		<div>
			<h2>{title}</h2>
			{children}
			<div className="color-swatches">{swatches}</div>
		</div>
	)
}
