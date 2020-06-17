import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import {
	SEARCH_USERS,
	SET_LOADING,
	CLEAR_USERS,
	GET_USER,
	GET_REPOS,
	PAGE_LOAD,
} from '../types';

let githubClientId;
let githubClientSecret;

if (process.env.NODE_ENV !== 'production') {
	githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
	githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
} else {
	githubClientId = process.env.GITHUB_CLIENT_ID;
	githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
}

const GithubState = props => {
	const initialState = {
		users: [],
		user: {},
		repos: [],
		loading: false,
	};

	const [state, dispatch] = useReducer(GithubReducer, initialState);

	// Page load
	useEffect(async () => {
		dispatch({ type: SET_LOADING });
		const res = await axios.get(
			`https://api.github.com/users?client_id=${githubClientId}&client_secret=${githubClientSecret}`
		);
		dispatch({
			type: PAGE_LOAD,
			payload: res.data,
		});
		// eslint-disable-next-line
	}, []);

	//Search user
	const searchUser = async text => {
		dispatch({ type: SET_LOADING });
		const res = await axios.get(
			`https://api.github.com/search/users?q=${text}&client_id=${githubClientId}&client_secret=${githubClientSecret}`
		);
		dispatch({
			type: SEARCH_USERS,
			payload: res.data.items,
		});
	};

	//Get user
	const getUser = async username => {
		dispatch({ type: SET_LOADING });
		const res = await axios.get(
			`https://api.github.com/users/${username}?client_id=${githubClientId}&client_secret=${githubClientSecret}`
		);
		dispatch({
			type: GET_USER,
			payload: res.data,
		});
	};

	//Get repos
	const getUserRepos = async username => {
		dispatch({ type: SET_LOADING });
		const res = await axios.get(
			`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${githubClientId}&client_secret=${githubClientSecret}`
		);
		dispatch({
			type: GET_REPOS,
			payload: res.data,
		});
	};

	//Clear users
	const clearUsers = () => {
		dispatch({ type: CLEAR_USERS });
	};

	return (
		<GithubContext.Provider
			value={{
				users: state.users,
				user: state.user,
				repos: state.repos,
				loading: state.loading,
				searchUser,
				clearUsers,
				getUser,
				getUserRepos,
			}}
		>
			{props.children}
		</GithubContext.Provider>
	);
};

export default GithubState;
