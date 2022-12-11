import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import {collection, getDocs, getDoc, deleteDoc, doc} from 'firebase/firestore'
import { db } from '../firebaseConfig/firebase'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { async } from '@firebase/util'

const MySwal = withReactContent(Swal)


const Show = () => {
    //1 - configuramos los hooks
    const [products, setProducts] = useState( [] )
  
    //2 - referenciamos a la DB firestore
    const productsCollection = collection(db, "products")
  
    //3 - Funcion para mostrar TODOS los docs
    const getProducts = async ()   => {
     const data = await getDocs(productsCollection)
     //console.log(data.docs)
     setProducts(
         data.docs.map( (doc) => ( {...doc.data(),id:doc.id}))
     )
     //console.log(products)
    }
    //4 - Funcion para eliminar un doc
    const deleteProduct = async (id) => {
     const productDoc = doc(db, "products", id)
     await deleteDoc(productDoc)
     getProducts()
    }

    //5 funcion para confirmacion para sweet alert 2
    const confirmDelete = (id) => {
        MySwal.fire({
          title: '¿Desea eliminar el producto?',
          text: "Esta accion no es reversible una vez eliminado!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
          if (result.isConfirmed) { 
            //llamamos a la accion para eliminar   
            deleteProduct(id)               
            Swal.fire(
              'Deleted!',
              'El producto ha sido eliminado.',
              'success'
            )
          }
        })    
      }
   //6 - usamos useEffect
   useEffect( () => {
     getProducts()
     // eslint-disable-next-line
    }, [] )
   //7 retornamos la cisa de los componentes
  return (
    <>
     <div className='container'>
        <div className='row'>
         <div className='col'>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Link to="/create" className='btn btn-primary mt-2 mb-2 btn-lg'>Create</Link>
            </div>
         <table className='table table-light table-hover'>
           <thead>
             <tr>
                <th scope="col">Description</th>
                <th scope="col">Stock</th>
                <th scope="col">Actions</th>
             </tr>
           </thead>

           <tbody>
                {
                    products.map((product)=>(
                        <tr key={product.id}>
                            <td>{product.description}</td>
                            <td>{product.stock}</td>
                            <td>
                            <Link to={`/edit/${product.id}`} className="btn btn-light "><i className="fa-solid fa-pencil"></i></Link>
                            <button onClick={ () => {confirmDelete(product.id) } } className="btn btn-outline-secondary "><i class="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                    ))
                }
           </tbody>

         </table>  
         </div>
        </div>
     </div>
    </>
  )
}

export default Show