import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

class Header extends Component {
  render() {
    return (
      <div>
        <Link to="/">
          title
        </Link>
        |
        <Link to="/recipes">
          recipes
        </Link>
        |
        <Link to="/kitchens">
          kitchens
        </Link>
        |
        <Link to="/meal">
          meal
        </Link>
        |
        <Link to="/settings">
          settings
        </Link>
      </div>
    )
  }
}

export default withRouter(Header)
