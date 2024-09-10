import React, { Component } from 'react'
import ApiClient from "../services/ApiClient"

class ChallengeComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
        a: '', b: '',
        user: '',
        message: '',
        guess: 0
    };
    this.handleSubmitResult = this.handleSubmitResult.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  /**
   * TODO: Fix this code so it's modernised React. This structure is way too monolithic and archaic.
   * TODO: Unify this so the code is consistent. Typing changes, lack of method consistency. It's a mess
   * TODO: Use react hooks. this.setState should be use state
   * (To anyone curious, I'm just following the React code for this tutorial. I will produce a cleaned up version)
   */
  
  componentDidMount(): void {
    console.log(this.state)
    ApiClient.challenge().then(
      res => {
        console.log("BANG")
        if(res.ok) {
          res.json().then(json => {
            this.setState({
              a: json.factorA,
              b: json.factorB
            });
          });
        } else {
          this.updateMessage("Can't reach the server");
        }
      }
    );
  }
  handleChange(event) {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value
    });
  }
  handleSubmitResult(event){
    event.preventDefault();
    ApiClient.sendGuess(this.state.user,
      this.state.a, this.state.b,
      this.state.guess)
      .then(res => {
        if(res.ok) {
          res.json().then(json => {
            if (json.correct) {
              this.updateMessage("Congratulations! Your guess is correct");
            } else {
              this.updateMessage(`Oops! Your guess ${json.resultAttempt} is wrong, but keep playing!`)
            }
          });
        } else {
          this.updateMessage("Error: server error or not available");
        }
    })
  }
  updateMessage(m: string) {
    this.setState({
      message: m
    });
  }
  render() {
    return (
      <div>
        <div>
          <h3>Your <bold>New</bold> challenge is</h3>
          <h1>
            {this.state.a} X {this.state.b}
          </h1>
        </div>
        <form onSubmit={this.handleSubmitResult}>
          <label>
            Your alias:
            <input type="text" maxLength="12" 
                   name="user"
                   value={this.state.user}
                   onChange={this.handleChange}/>
          </label>
          <br />
          <label> 
            Your guess:
            <input type="number" min="0"
                   name="guess"
                   value={this.state.guess}
                   onChange={this.handleChange}/>
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
        <h4>{this.state.message}</h4>
      </div>
    )
  }
}

export default ChallengeComponent;