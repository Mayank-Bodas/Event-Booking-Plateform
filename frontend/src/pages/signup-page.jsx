import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/lib/api";
import { useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "ATTENDEE",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });
            navigate("/login");
        } catch (err) {
            setError(err.message || "Failed to register");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative">
            <Button
                variant="ghost"
                className="absolute top-4 left-4 text-gray-400 hover:text-white"
                onClick={() => navigate("/")}
            >
                ← Back to Home
            </Button>
            <div className="w-full max-w-md space-y-8 bg-gray-900 p-8 rounded-lg border border-gray-800">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Create Account</h1>
                    <p className="text-gray-400 mt-2">Join the Event Ticket Platform</p>
                </div>

                {error && (
                    <Alert variant="destructive" className="bg-red-900/50 border-red-900">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input
                            required
                            className="bg-gray-800 border-gray-700 text-white"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            required
                            type="email"
                            className="bg-gray-800 border-gray-700 text-white"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input
                            required
                            type="password"
                            className="bg-gray-800 border-gray-700 text-white"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Confirm Password</label>
                        <Input
                            required
                            type="password"
                            className="bg-gray-800 border-gray-700 text-white"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                                setFormData({ ...formData, confirmPassword: e.target.value })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Role</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.role}
                            onChange={(e) =>
                                setFormData({ ...formData, role: e.target.value })
                            }
                        >
                            <option value="ATTENDEE">Attendee</option>
                            <option value="ORGANIZER">Organizer</option>
                            <option value="STAFF">Staff</option>
                        </select>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-white text-black hover:bg-gray-200"
                        disabled={isLoading}
                    >
                        {isLoading ? "creating account..." : "Sign Up"}
                    </Button>

                    <div className="text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <Button
                            variant="link"
                            className="text-white p-0 h-auto font-normal"
                            onClick={() => navigate("/login")}
                            type="button"
                        >
                            Log in
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
