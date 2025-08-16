"use client";

import SignupFlowModal from '../../../components/Auth/SignupFlowModal';

export default function SignupDetailsPage() {
	return <SignupFlowModal onClose={() => history.back()} />;
} 