import * as React from 'react';
import { withRouter } from 'react-router-dom';

import classnames from 'classnames';
import { History } from 'history';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { languages } from '../../api/config';

import {
    changeColorTheme,
    selectCurrentColorTheme,
    RootState,
    changeLanguage,
    selectCurrentLanguage,
} from '../../modules';


import { colors } from '../../constants';
import { Moon } from '../../assets/images/Moon';
import { Sun } from '../../assets/images/Sun';

interface State {
    isOpenLanguage: boolean;
}
interface DispatchProps {
    changeLanguage: typeof changeLanguage;
    changeColorTheme: typeof changeColorTheme;
}
interface ReduxProps {
    colorTheme: string;
    lang: string;
}
interface OwnProps {
    onLinkChange?: () => void;
    history: History;
}
type Props = ReduxProps & DispatchProps & OwnProps;

class FooterComponent extends React.Component<Props, State> {
    public state = {
        isOpenLanguage: false,
    };
    public render() {
        if (this.props.history.location.pathname.startsWith('/confirm')) {
            return <React.Fragment />;
        }
        const {lang, colorTheme} = this.props;
        const { isOpenLanguage } = this.state;
        const languageName = lang.toUpperCase();
        const languageClassName = classnames('dropdown-menu-language-field', {
            'dropdown-menu-language-field-active': isOpenLanguage,
        });

        return (
            <React.Fragment>
                <footer className="pg-footer">
                    <div className="pg-sidebar-wrapper-lng">
                        <div className="btn-group pg-navbar__header-settings__account-dropdown dropdown-menu-language-container">
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" id={languageClassName}>
                                    <img
                                        src={this.tryRequire(lang) && require(`../../assets/images/sidebar/${lang}.svg`)}
                                        alt={`${lang}-flag-icon`}
                                    />
                                    <span className="dropdown-menu-language-selected">{languageName}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {this.getLanguageDropdownItems()}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="pg-navbar__header-settings">
                        <div className="pg-navbar__header-settings__switcher">
                            <div
                                className="pg-navbar__header-settings__switcher__items"
                                onClick={e => this.handleChangeCurrentStyleMode(colorTheme === 'light' ? 'basic' : 'light')}
                            >
                                {this.getLightDarkMode()}
                            </div>
                        </div>
                    </div>
                </footer>
            </React.Fragment>
        );
    }

    private tryRequire = (name: string) => {
        try {
            require(`../../assets/images/sidebar/${name}.svg`);
            return true;
        } catch (err) {
            return false;
        }
    };

    public getLanguageDropdownItems = () => {
        return languages.map((l: string) =>
            <Dropdown.Item onClick={e => this.handleChangeLanguage(l)}>
                <div className="dropdown-row">
                    <img
                        src={this.tryRequire(l) && require(`../../assets/images/sidebar/${l}.svg`)}
                        alt={`${l}-flag-icon`}
                    />
                    <span>{l.toUpperCase()}</span>
                </div>
            </Dropdown.Item>,
        );
    };

    private handleChangeLanguage = (language: string) => {
        this.props.changeLanguage(language);
    }

    
    private handleChangeCurrentStyleMode = (value: string) => {
        this.props.changeColorTheme(value);
    };
    
    private getLightDarkMode = () => {
        const { colorTheme } = this.props;

        if (colorTheme === 'basic') {
            return (
                <React.Fragment>
                    <div className="switcher-item">
                        <Sun fillColor={colors.light.navbar.sun}/>
                    </div>
                    <div className="switcher-item switcher-item--active">
                        <Moon fillColor={colors.light.navbar.moon}/>
                    </div>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <div className="switcher-item switcher-item--active">
                    <Sun fillColor={colors.basic.navbar.sun}/>
                </div>
                <div className="switcher-item">
                    <Moon fillColor={colors.basic.navbar.moon}/>
                </div>
            </React.Fragment>
        );
    };

}
const mapStateToProps = (state: RootState): ReduxProps => ({
    lang: selectCurrentLanguage(state),
    colorTheme: selectCurrentColorTheme(state),
});
const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeLanguage: payload => dispatch(changeLanguage(payload)),
        changeColorTheme: payload => dispatch(changeColorTheme(payload)),
    });
// tslint:disable-next-line:no-any
const Footer = withRouter(connect(mapStateToProps, mapDispatchToProps)(FooterComponent) as any) as any;

export {
    Footer,
};
