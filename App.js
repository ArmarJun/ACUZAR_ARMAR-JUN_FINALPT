import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDs8s7EVC2wC8CuQ85KdWL_rG2ou3cogdw",
  authDomain: "fir-9be60.firebaseapp.com",
  projectId: "fir-9be60",
  storageBucket: "fir-9be60.appspot.com",
  messagingSenderId: "1054070562630",
  appId: "1:1054070562630:web:9961c01b435cfb20fc0f47",
  measurementId: "G-G31PK8X93S"
};

const app = initializeApp(firebaseConfig);

const SignUpScreen = ({ name, setName, email, setEmail, password, setPassword, handleSignUp, switchToSignIn }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={handleSignUp} color="#3498db" />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={switchToSignIn}>
          Already have an account? Login
        </Text>
      </View>
    </View>
  );
};

const SignInScreen = ({ email, setEmail, password, setPassword, handleSignIn, switchToSignUp }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="LOGIN" onPress={handleSignIn} color="#3498db" />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={switchToSignUp}>
          Need an account? Sign Up
        </Text>
      </View>
    </View>
  );
};

const AuthenticatedScreen = ({ user, handleLogout }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.emailText}>{user.email}</Text>
      <Button title="Logout" onPress={handleLogout} color="#e74c3c" />
    </View>
  );
};

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // Track user authentication state
  const [isLogin, setIsLogin] = useState(true);

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created successfully!');
    } catch (error) {
      console.error('Sign up error:', error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully!');
    } catch (error) {
      console.error('Sign in error:', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        <AuthenticatedScreen user={user} handleLogout={handleLogout} />
      ) : (
        isLogin ? (
          <SignInScreen
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSignIn={handleSignIn}
            switchToSignUp={() => setIsLogin(false)}
          />
        ) : (
          <SignUpScreen
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSignUp={handleSignUp}
            switchToSignIn={() => setIsLogin(true)}
          />
        )
      )}
    </ScrollView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e1f5fe', // Light blue background
  },
  authContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    color: '#34495e',
    fontWeight: '700',
  },
  input: {
    height: 50,
    borderColor: '#3498db',
    borderWidth: 2,
    marginBottom: 25,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#ecf0f1',
    color: '#34495e',
  },
  buttonContainer: {
    marginBottom: 20,
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 15,
  },
  bottomContainer: {
    marginTop: 30,
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 25,
    color: '#7f8c8d',
  },
});

