import React, {Component} from 'react'
import PropTypes from 'prop-types';
import request from 'superagent'
import { Link, Redirect } from 'react-router-dom'
// material
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import purple from '@material-ui/core/colors/purple';
import Button from '@material-ui/core/Button';
// semantic
import { Divider } from 'semantic-ui-react'
// css
import './login.css';
import 'materialize-css';
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
class SNSLogin extends Component {
  constructor (props) {
    super(props)
    this.state = { userid: '', passwd: '', jump: '', msg: '' }
    this.loginValidation = this.loginValidation.bind(this);

  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
  }
  
  loginValidation() {
    console.log('loginvalidation====')    
    !$('#userid').val()
     || !$('#passwd').val() ? 
    alert("로그인 정보를 확인해주세요") 
    : this.api('login');
  }

  // API를 호출하고 응답받은 토큰을 localStorage에 저장하기 --- (※1)
  api (command) {
    console.log('api====')
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
          window.localStorage['snsuserid'] = this.state.userid
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
    const { classes } = this.props;
    return (
      <div className="loginBox">
      <div className="totalBox">
      <div className="title">
        <h2>LOGIN</h2>
      </div>
      <div className="_id">
        <FormControl>
        <InputLabel shrink htmlFor="userid" >
          ID
        </InputLabel>
        <InputBase
          id="userid"
          type='text'
          onChange={e => changed('userid', e)}
          classes={{
            root: classes.bootstrapRoot,
            input: classes.bootstrapInput,
          }}
        />
        </FormControl>
      </div>
      <div className="password">
        <FormControl>
        <InputLabel shrink htmlFor="passwd" >
          PASSWORD
        </InputLabel>
        <InputBase
          id="passwd"
          type='password'
          onChange={e => changed('passwd', e)}
          classes={{
            root: classes.bootstrapRoot,
            input: classes.bootstrapInput,
          }}
        />
        </FormControl>
      </div>
      </div>
      <div className="submitBox">
      <div>
        <Button 
          variant="outlined"
          color="primary" 
          className="loginBtn"
          onClick={this.loginValidation}>
          LOGIN
        </Button>
      </div>
      <div>
        <Divider className="divider" horizontal>Or</Divider>
      </div>
      <div className="joinBox">
        <Link to="/join">
          <Button variant="outlined" color="secondary" className="joinBtn">
            SIGN UP
          </Button>
        </Link>
      </div>
      </div> 
      {/* submitBox end */}
    </div>
    )
  }
}

export default withStyles(styles)(SNSLogin);