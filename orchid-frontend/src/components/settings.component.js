import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Collapse, Tag, Input, Tooltip, Icon, InputNumber, Table, Select, Option} from 'antd';
import '../stylesheets/settings.scss';
import style from 'antd/dist/antd.css';

const { Panel } = Collapse;

export default function SettingsComponent(props){
    const [state, setState] = useState();
    
    return(
        <div className="settings-container">
        <Collapse>
            <Panel header="Users" key="1">
                <UserSettings />
            </Panel>
            <Panel header="Stores" key="2">
            <StoreSettings/>
            </Panel>
            <Panel header="Categories" key="3">
            <CategorySettings/>
            </Panel>
            <Panel header="Stock Rules" key="4">
                <div>
                    <h2>Low Stock Number</h2>
                    <InputNumber min={0} defaultValue={localStorage.lowStock || 1} onChange={(e) => {localStorage.lowStock = e}}/>
                </div>
            </Panel>
            <Panel header="Discount Rules" key="5">
                <div>
                    <h2>Initial Discount</h2>
                    <InputNumber min={0} defaultValue={localStorage.initialDiscount || 5} onChange={(e) => {localStorage.initialDiscount = e}}/>%
                    <h2>Increment Every</h2>
                    <InputNumber min={0} defaultValue={localStorage.incrementDiscount || 1500} onChange={(e) => {localStorage.incrementDiscount = e}}/>$
                </div>
            </Panel>
        </Collapse>
        </div>
    )
}

function UserSettings(props){
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({});
    useEffect(() => {
        axios.get('http://localhost:3001/users/users')
        .then((response) => {
            setUsers(response.data.users);
        });
    }, []);

    function handleDelete(e){
        axios.post('http://localhost:3001/users/delete', {
            user: e
        }).then((response)=>{
            setUsers(response.data.users);
        })
    }

    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Username',
          dataIndex: 'username',
          key: 'username',
        },
        {
          title: 'Role',
          dataIndex: 'role',
          key: 'role',
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <span>
              <a 
              onClick={record.role !="Admin" ? ()=>handleDelete(record._id) : ""} 
              style={record.role =="Admin" ? {color: "gray", cursor: "no-drop"}: {}}>Delete</a>
            </span>
          ),
        },
      ];
      

    let userData = users.map((val, index) =>{
        return {
            _id: val._id,
            key: index,
            name: val.name,
            username: val.username,
            role: val.role
        }
    } )

    return (
    <Table columns={columns} dataSource={userData} />
    )
}

function StoreSettings(props){
    const [stores, setStores] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [inputVisible, setInputVisible] = useState(false);
    let input;
    
    useEffect(() =>{
        axios.get('http://localhost:3001/stores/')
        .then((response) =>{
            setStores(response.data.stores);
        })
        .catch(err => console.log(err));
    }, []);


    useEffect(() =>{
        if(input)
            input.focus();
    });
    
    let handleClose = removedTag => {
        const tags = stores.filter(tag => tag._id !== removedTag);
        console.log(tags);
        axios.post('http://localhost:3001/stores/delete', {
            store: removedTag,
        })
        .then((response) =>{
            console.log(response.data.stores);
            setStores(response.data.stores);
        })
        .catch((err)=>{
            console.log(err);
        });
      };
    
    let showInput = () => {
        setInputVisible(true);
      };
    
    let handleInputChange = e => {
        setInputValue(e.target.value);
      };
    
    let handleInputConfirm = () => {
        let tags = JSON.parse(JSON.stringify(stores));
        if (inputValue) {
            axios.post('http://localhost:3001/stores/', {
                store: inputValue,
            })
            .then((response) =>{
                setStores(response.data.stores);
            })
            .catch((err)=>{
            });
        }
        
          setStores(tags);
          setInputVisible(false);
          setInputValue('');
      };
      let saveInputRef = inp => (input = inp);
      console.log(stores);
      return(
      <div>
        {stores.map((tag, index) => {
        const isLongTag = tag.name.length > 20;
        const tagElem = (
            <Tag key={tag._id} closable={true} onClose={() => handleClose(tag._id)}>
            {isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}
            </Tag>
        );
        return isLongTag ? (
            <Tooltip title={tag.name} key={tag._id}>
            {tagElem}
            </Tooltip>
        ) : (
            tagElem
        );
        })}
        {inputVisible && (
        <Input
            ref={saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
        />
        )}
        {!inputVisible && (
        <Tag onClick={showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
            <Icon type="plus" /> New Tag
        </Tag>
        )}
    </div>
      )
}

function CategorySettings(props){
    const [categories, setCategories] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [inputVisible, setInputVisible] = useState(false);
    let input;

    useEffect(() =>{
        axios.get('http://localhost:3001/categories/')
        .then((response) =>{
            setCategories(response.data.categories);
        })
        .catch(err => console.log(err));
    }, []);

    useEffect(() =>{
        if(input)
            input.focus();
    });
    
    let handleClose = removedTag => {
        const tags = categories.filter(tag => tag !== removedTag);
        axios.post('http://localhost:3001/categories/delete', {
            category: removedTag,
        })
        .then((response) =>{
            setCategories(response.data.categories);
        })
        .catch((err)=>{
            console.log(err);
        });
      };
    
    let showInput = () => {
        setInputVisible(true);
      };
    
    let handleInputChange = e => {
        setInputValue(e.target.value);
      };
    
    let handleInputConfirm = () => {
        let tags = JSON.parse(JSON.stringify(categories));
        if (inputValue) {
            axios.post('http://localhost:3001/categories/', {
                category: inputValue,
            })
            .then((response) =>{
                setCategories(response.data.categories);
            })
            .catch((err)=>{
            });
        }
        
          setCategories(tags);
          setInputVisible(false);
          setInputValue('');
      };
      let saveInputRef = inp => (input = inp);
      console.log(categories);
      return(
      <div>
        {categories.map((tag, index) => {
        const isLongTag = tag.length > 20;
        const tagElem = (
            <Tag key={tag._id} closable={true} onClose={() => handleClose(tag._id)}>
            {isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}
            </Tag>
        );
        return isLongTag ? (
            <Tooltip title={tag} key={tag}>
            {tagElem}
            </Tooltip>
        ) : (
            tagElem
        );
        })}
        {inputVisible && (
        <Input
            ref={saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
        />
        )}
        {!inputVisible && (
        <Tag onClick={showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
            <Icon type="plus" /> New Tag
        </Tag>
        )}
    </div>
      )
}