// ----- Imports ----- //
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { getUser } from './user';

// ----- Types ----- //
export type User = {
	id: string | null | undefined;
	email: string;
	displayName?: string | null;
	firstName: string;
	lastName: string;
	fullName: string;
	isTestUser?: boolean | null;
	isPostDeploymentTestUser: boolean;
	stateField: string;
	gnmMarketing: boolean;
	isSignedIn: boolean;
	isRecurringContributor: boolean;
	emailValidated: boolean;
	isReturningContributor: boolean;
	address4?: string | null;
};

const userInfo = getUser();

const initialState: User = {
	id: '',
	email: userInfo.email ?? '',
	displayName: '',
	firstName: userInfo.firstName ?? '',
	lastName: userInfo.lastName ?? '',
	fullName: '',
	stateField: '',
	isTestUser: null,
	isPostDeploymentTestUser: false,
	gnmMarketing: false,
	isSignedIn: userInfo.isSignedIn,
	isRecurringContributor: false,
	emailValidated: false,
	isReturningContributor: false,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setId(state, action: PayloadAction<string>) {
			state.id = action.payload;
		},
		setDisplayName(state, action: PayloadAction<string>) {
			state.displayName = action.payload;
		},
		setFirstName(state, action: PayloadAction<string>) {
			state.firstName = action.payload;
		},
		setLastName(state, action: PayloadAction<string>) {
			state.lastName = action.payload;
		},
		setFullName(state, action: PayloadAction<string>) {
			state.fullName = action.payload;
		},
		setEmail(state, action: PayloadAction<string>) {
			state.email = action.payload;
		},
		setStateField(state, action: PayloadAction<string>) {
			state.stateField = action.payload;
		},
		setTestUser(state, action: PayloadAction<boolean>) {
			state.isTestUser = action.payload;
		},
		setPostDeploymentTestUser(state, action: PayloadAction<boolean>) {
			state.isPostDeploymentTestUser = action.payload;
		},
		setGnmMarketing(state, action: PayloadAction<boolean>) {
			state.gnmMarketing = action.payload;
		},
		setEmailValidated(state, action: PayloadAction<boolean>) {
			state.emailValidated = action.payload;
		},
		setIsReturningContributor(state, action: PayloadAction<boolean>) {
			state.isRecurringContributor = action.payload;
		},
		setIsSignedIn(state, action: PayloadAction<boolean>) {
			state.isSignedIn = action.payload;
		},
		setIsRecurringContributor(state) {
			state.isRecurringContributor = true;
		},
	},
});

export const userReducer = userSlice.reducer;

export const userActions = userSlice.actions;

export type UserActions = typeof userActions;
