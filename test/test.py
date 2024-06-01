# streamlit run "c:\Program Files (x86)\Common Files\Adobe\CEP\extensions\vt\test\test.py"
import streamlit as st
import threading

def main():
    st.write("Hello, World!")

    def sub_thread():
        
        st.sidebar.success("子线程已完成")

    t = threading.Thread(target=sub_thread)
    t.start()

if __name__ == "__main__":
    main()