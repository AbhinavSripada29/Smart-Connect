import { create } from "zustand";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";

const useUserSessionStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  userType: localStorage.getItem("userType") || null,
  loading: true,

  initializeAuth: () => {
    set({ loading: true });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        set({
          user: { uid: currentUser.uid, email: currentUser.email },
          userType: "student",
          loading: false,
        });

        localStorage.setItem("user", JSON.stringify({ uid: currentUser.uid, email: currentUser.email }));
        localStorage.setItem("userType", "student");
      } else {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedUserType = localStorage.getItem("userType");

        if (storedUser && storedUserType) {
          set({ user: storedUser, userType: storedUserType, loading: false });
        } else {
          set({ user: null, userType: null, loading: false });
          localStorage.removeItem("user");
          localStorage.removeItem("userType");
        }
      }
    });

    return unsubscribe;
  },

  login: async (email, password, userType) => {
    if (userType === "student") {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        set({
          user: { uid: userCredential.user.uid, email: userCredential.user.email },
          userType: "student",
        });

        localStorage.setItem("user", JSON.stringify({ uid: userCredential.user.uid, email: userCredential.user.email }));
        localStorage.setItem("userType", "student");

        return userCredential.user;
      } catch (error) {
        console.error("Login error:", error.message);
        throw error;
      }
    } else {
      // Faculty Authentication (Firestore-based)
      try {
        console.log("🔍 Checking faculty login for:", email);

        const facultyQuery = query(collection(db, "faculty"), where("mailid", "==", email));
        const facultySnapshot = await getDocs(facultyQuery);

        if (facultySnapshot.empty) {
          console.warn("❌ Faculty not found:", email);
          throw new Error("Invalid email or password.");
        }

        const facultyDoc = facultySnapshot.docs[0];
        const faculty = facultyDoc.data();

        console.log("👤 Faculty found:", faculty);

        if (!faculty.password) {
          console.error("🚨 Password missing in Firestore for:", email);
          throw new Error("Authentication error. Please contact support.");
        }

        // ✅ Direct password comparison (Assuming plaintext, ideally use hashing)
        if (password !== faculty.password) {
          throw new Error("Invalid email or password.");
        }

        // ✅ Store session & persist login
        set({ user: { email }, userType: "faculty" });

        localStorage.setItem("user", JSON.stringify({ email }));
        localStorage.setItem("userType", "faculty");

        return { success: true };
      } catch (error) {
        console.error("Faculty login error:", error.message);
        throw error;
      }
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, userType: null });

      localStorage.removeItem("user");
      localStorage.removeItem("userType");
    } catch (error) {
      console.error("Logout error:", error.message);
      throw error;
    }
  },
}));

export default useUserSessionStore;
