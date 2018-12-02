import React, {Component} from 'react'
import PropTypes from 'prop-types';
import request from 'superagent'
import {Redirect} from 'react-router-dom'
// material
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import purple from '@material-ui/core/colors/purple';
import Button from '@material-ui/core/Button';
// semantic
import { Divider } from 'semantic-ui-react'
import styles from './styles'
// css
import '../css/login.css';
import 'materialize-css';
import '../../webapp/css/Login.css';
// etc
import $ from 'jquery';
window.$ = $;

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  cssLabel: {
    '&$cssFocused': {
      color: purple[500],
    },
  },
  cssFocused: {},
  cssUnderline: {
    '&:after': {
      borderBottomColor: purple[500],
    },
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: purple[500],
    },
  },
  notchedOutline: {},
  bootstrapRoot: {
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
  bootstrapInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  bootstrapFormLabel: {
    fontSize: 18,
  },
});

// 로그인 화면 컴포넌트
export default class SNSLogin extends Component {
  constructor (props) {
    super(props)
    this.state = { userid: '', passwd: '', jump: '', msg: '' }
  }
  // API를 호출하고 응답받은 토큰을 localStorage에 저장하기 --- (※1)
  api (command) {
    request
      .get('/api/' + command)
      .query({
        userid: this.state.userid,
        passwd: this.state.passwd
      })
      .end((err, res) => {
        if (err) return
        const r = res.body
        console.log(r)
        if (r.status && r.token) {
          // 인증 토큰을 localStorage에 저장하기
          window.localStorage['sns_id'] = this.state.userid
          window.localStorage['sns_auth_token'] = r.token
          this.setState({jump: '/timeline'})
          return
        }
        this.setState({msg: r.msg})
      })
  }
  render () {
    if (this.state.jump) {
      return <Redirect to={this.state.jump} />
    }
    const changed = (name, e) => this.setState({[name]: e.target.value})
    return (
      <div>
        <h1>로그인</h1>
        <div style={styles.login}>
          사용자 ID:<br />
          <input value={this.state.userid}
            onChange={e => changed('userid', e)} /><br />
          비밀번호:<br />
          <input type='password' value={this.state.passwd}
            onChange={e => changed('passwd', e)} /><br />
          <button onClick={e => this.api('login')}>로그인</button><br />
          <p style={styles.error}>{this.state.msg}</p>
          <p><button onClick={e => this.api('adduser')}>
            사용자 등록</button></p>
        </div>
      </div>
    )
  }
}