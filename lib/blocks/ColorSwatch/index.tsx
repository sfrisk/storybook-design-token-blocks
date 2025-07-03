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
		return '✅ AAA Pass'
	}
	if (
		tinycolor.isReadable(bgColor, textColor, {
			level: 'AA',
			size: size
		})
	) {
		return '⚠️ AA Pass'
	}
	return '⛔ Fail'
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
			<ul
				role="table"
				className="sb-unstyled color-swatch__table"
			>
				<li
					role="row"
					className="color-swatch__row sb_unstyled"
				>
					<div className="color-swatch__header">{title}</div>
					<div className="color-swatch__header">
						{colorValue || 'Not found'}
					</div>
				</li>
				<li
					role="row"
					className="color-swatch__row"
				>
					var({cssVar})
				</li>
				<li
					role="row"
					className="color-swatch__row"
				>
					<div className="color-swatch__title">Text Size</div>
					<div className="color-swatch__large-text">
						<span className="sr-only">Large Text</span>Aa
					</div>
					<div className="color-swatch__small-text">
						<span className="sr-only">Small Text</span>Aa
					</div>
				</li>
				{contrasts.map((item) => (
					<li
						role="row"
						className="color-swatch__row"
					>
						<div className="light-text color-swatch__title">
							{item.title} ({item.readability})
						</div>
						<div>
							<span className="color-swatch__badge">
								<span className="sr-only">Large Text</span>
								{item.large}
							</span>
						</div>
						<div>
							<span className="color-swatch__badge">
								<span className="sr-only">Small Text</span>
								{item.small}
							</span>
						</div>
					</li>
				))}
			</ul>
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
