import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { debouncedResize } from '../utils';
import ModalHeader from './modal-header.jsx';
import DefaultModalFooter from './default-modal-footer.jsx';
import * as Styled from './styled.jsx';

/**
 * Modal
 */
export default class Modal extends React.Component {
	static propTypes = {
		/** controls state of modal */
		isOpen: PropTypes.bool.isRequired,
		/** Title of the modal */
		title: PropTypes.oneOfType(PropTypes.string, PropTypes.node).isRequired,
		/** Any explaining text to include in the modal header */
		subtitle: PropTypes.string,
		/** Callback function for when the modal is close  */
		onClose: PropTypes.func.isRequired,
		/** Contents of the modal */
		children: PropTypes.node.isRequired,
		/** Customizable theme properties */
		theme: PropTypes.object,
		/** values for rendering an FL standard footer */
		footerProps: PropTypes.shape({
			commitButton: PropTypes.shape({
				onClick: PropTypes.func.isRequired,
				text: PropTypes.string.isRequired,
			}),
			cancelButton: PropTypes.shape({
				onClick: PropTypes.func.isRequired,
				text: PropTypes.string.isRequired,
			}),
			deleteButton: PropTypes.shape({
				onClick: PropTypes.func.isRequired,
				text: PropTypes.string.isRequired,
			}),
		}),
		/**  */
		renderFooter: PropTypes.func,
	};

	static defaultProps = {
		theme: {
			background: 'white',
		},
	};

	state = {};

	componentDidMount() {
		this.resizeListener = debouncedResize(this.handleResize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resizeListener);
	}

	handleResize = () => {
		if (this._modal) {
			this.setState({ modalWidth: this._modal.clientWidth });
		}
	};

	handleBackdropClick = backdrop => {
		if (backdrop.target === this._backdrop) {
			this.props.onClose();
		}
	};

	render() {
		const {
			theme,
			title,
			subtitle,
			onClose,
			isOpen,
			children,
			renderFooter,
			footerProps,
		} = this.props;

		if (!isOpen) {
			return null;
		}

		const { modalWidth } = this.state;

		const verticalButtons =
			modalWidth &&
			!renderFooter &&
			(modalWidth < 220 || (modalWidth < 320 && Object.keys(footerProps).length === 3));

		return (
			<ThemeProvider theme={{ ...theme, verticalButtons }}>
				<Styled.Backdrop
					innerRef={backdrop => {
						this._backdrop = backdrop;
					}}
					onClick={this.handleBackdropClick}
				>
					<Styled.Modal
						innerRef={modal => {
							this._modal = modal;
							if (modal && !modalWidth) this.setState({ modalWidth: modal.clientWidth });
						}}
					>
						<ModalHeader title={title} subtitle={subtitle} onClose={onClose} />
						{children}
						{renderFooter ? (
							renderFooter()
						) : (
							<DefaultModalFooter useFullWidthButtons={verticalButtons} {...footerProps} />
						)}
					</Styled.Modal>
				</Styled.Backdrop>
			</ThemeProvider>
		);
	}
}
